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
         Task<User> GetUser(int Id , bool isCurrentUser);
         Task<Photo> GetPhoto(int id);
         abstract Task<Photo> GetMainPhotoForUSer(int userId);
         Task<Like> GetLike(int userId ,int recipionetId);
         Task<Message> GetMessage(int id);
         Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);
         Task<IEnumerable<Message>> GetConvarsation(int userId , int recipientId);
         Task<int> GetUnreadMessagesForUser(int userId);
         Task<Payment> GetPaymentForUser(int userId);
         Task<ICollection<User>>  GetLikersOrLikees(int userId, string type);
         Task<ICollection<User>> GetAllUsersExceptAdmin();
    }
}