using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Helpers;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class ZawajRepositry : IZawajRepository
    {
        private readonly DataContext _context;
        public ZawajRepositry(DataContext context)
        {
            this._context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Photo> GetMainPhotoForUSer(int userId)
        {
            return await _context.Photos.Where(p => p.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<User> GetUser(int Id)
        {
            var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(a =>a.Id == Id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(u => u.Photos).OrderByDescending(u =>u.LastActive).AsQueryable();
            users =users.Where( u => u.Id != userParams.UserId);
            users =users.Where(g =>g.Gender == userParams.Gender); 
            if(userParams.MinAge != 18 || userParams.MaxAge != 99){
                var minDtb =DateTime.Today.AddYears(- userParams.MaxAge -1 );
                var maxDob = DateTime.Today.AddYears( -  userParams.MinAge);
                users =users.Where(u => u.DateOfBirth >= minDtb && u.DateOfBirth <= maxDob );

            }
            if(! string.IsNullOrEmpty(userParams.OrderBy)){
                switch (userParams.OrderBy)
                {
                    case "created":
                    users =users.OrderByDescending(u => u.Created);
                    break;

                    default:
                    users =users.OrderByDescending(u => u.LastActive);
                    break;
                }  
            }
            return await PagedList<User>.CreateAsync(users ,userParams.PageNumber ,userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
           return  await _context.SaveChangesAsync() >0;
        }
    }
}