using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ZwajApp.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using ZwajApp.API.Helpers;
using AutoMapper;
using ZwajApp.API.Models;
using Stripe;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace ZwajApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(d =>d.UseSqlite(Configuration.GetConnectionString("DefaulConnection")));

            IdentityBuilder builder = services.AddIdentityCore<User>(opt=>{
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
            });
            builder = new IdentityBuilder(builder.UserType,typeof(Role),builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(Options =>
            {
                Options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false

                };
            });

            
            services.AddControllers();
            //services.AddCors();
            services.AddCors(options =>
                        {
                            options.AddDefaultPolicy(builder => 
                                builder.SetIsOriginAllowed(_ => true)
                                .AllowAnyMethod()
                                .AllowAnyHeader()
                                .AllowCredentials());
                        });

            services.AddSignalR();

            services.AddAutoMapper();
           // Mapper.Reset();
            
            //Make Authorize attribute for all controllery
            services.AddMvc(opt =>{
                var policy =new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            });
            services.AddAuthorization(
                option =>{
                    option.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                    option.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin","Moderator"));
                    option.AddPolicy("VipOnly", policy => policy.RequireRole("VIP"));
                }
            );

            services.AddTransient<TrialData>();

            //Make Concante class prop With AppSettings
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySetting"));
            services.Configure<StripeSettings>(Configuration.GetSection("Stripe"));

            //services.AddScoped<IAuthRepository,AuthRepository>();
            services.AddScoped<IZawajRepository,ZawajRepositry>();

            //Action Filter
            services.AddScoped<LogUserActivity>();

           

           
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env ,TrialData trialData)
        {
            StripeConfiguration.SetApiKey(Configuration.GetSection("Stripe:SecretKey").Value);
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
            //  app.UseHsts();

            // for any error handler
               app.UseExceptionHandler(BuilderExtensions =>
                {
                    BuilderExtensions.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
                
            }

            // app.UseMvc();
            // app.UseHttpsRedirection();

            trialData.TrialUsers();
            //app.UseCors(x =>x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader().AllowCredentials());
            app.UseCors();
          
            app.UseAuthentication();
            
            app.UseRouting();

            app.UseAuthorization();

            // in asp core 2.1  only
            //app.UseSignalR(routes => {  routes.MapHub<ChatHub>("/chat"); });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                // in asp core 3 above
                endpoints.MapHub<ChatHub>("/chat");
            });
        }
    }
}
