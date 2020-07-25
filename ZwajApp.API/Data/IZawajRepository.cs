using System.Collections.Generic;
using System.Threading.Tasks;
using ZwajApp.API.Helpers;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public interface IZawajRepository
    {
         void Add <T>(T entity) where T:class;
         void Delete <T>(T entity) where T:class;
         Task<bool> SaveAll();
         Task<PagedList<User>> GetUsers(UserParams userParams);
         Task<User> GetUser(int Id);
         Task<Photo> GetPhoto(int id);
        abstract Task<Photo> GetMainPhotoForUSer(int userId);
    }
}