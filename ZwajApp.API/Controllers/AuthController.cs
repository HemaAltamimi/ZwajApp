using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;

namespace ZwajApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController :ControllerBase
    {
        private readonly IAuthRepository  _repo ;
        private readonly IConfiguration  _config ;
        public AuthController(IAuthRepository repo ,IConfiguration config)
        {
            _repo=repo;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto ){
            //validation
            userForRegisterDto.Username =userForRegisterDto.Username.ToLower();
            if(await _repo.UserExists(userForRegisterDto.Username)) return BadRequest(" هذا المستخدم مسجل من قبل");

            var user = new User{
                Username =userForRegisterDto.Username
             };
            var createdUser =  await _repo.Register(user ,userForRegisterDto.Password);

            return StatusCode(201);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto){
            var userFromRespo =await _repo.Login(userForLoginDto.Username.ToLower(),userForLoginDto.Password);
            if(userFromRespo == null) return Unauthorized();
            var calims = new[]{
                new Claim(ClaimTypes.NameIdentifier,userFromRespo.Id.ToString()),
                new Claim(ClaimTypes.Name,userFromRespo.Username)
            };

            var key =new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512);
            var tokenDescriptor =new SecurityTokenDescriptor{
                Subject =new ClaimsIdentity(calims),
                Expires =DateTime.Now.AddDays(1),
                SigningCredentials =creds

            };

            var tokenHandler=new JwtSecurityTokenHandler();

            var token =tokenHandler.CreateToken(tokenDescriptor);

            return Ok( new{
                token =tokenHandler.WriteToken(token)
            });
        }

    }
}