using System.Linq;
using AutoMapper;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Helpers
{
    public class AutoMapperProfiles :Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User,UserForListDto>()
            .ForMember(dest =>dest.PhotoURL ,opt =>{opt.MapFrom(scr =>scr.Photos.FirstOrDefault(p =>p.IsMain).Url);})
            .ForMember(dest =>dest.Age ,opt =>{opt.ResolveUsing(src =>src.DateOfBirth.CalculateAge());});


            CreateMap<User,UserForDetailsDto>()
            .ForMember(dest =>dest.PhotoURL ,opt =>{opt.MapFrom(scr =>scr.Photos.FirstOrDefault(p =>p.IsMain).Url);})
            .ForMember(dest =>dest.Age ,opt =>{opt.ResolveUsing(src =>src.DateOfBirth.CalculateAge());});

            CreateMap<Photo,PhotoForDetailsDto>();
            CreateMap<Photo,PhotoForReturnDto>();
            CreateMap<PhotoForCreateDto,Photo>();
 

             CreateMap<UserForUpdateDto,User>();

            CreateMap<UserForRegisterDto,User>();
            
            CreateMap<MessageForCreationDto,Message>().ReverseMap();

            CreateMap<Message,MessageToReturnDto>()
            .ForMember(dest =>dest.SenderPhotoUrl ,opt =>{opt.MapFrom(scr =>scr.Sender.Photos.FirstOrDefault(p =>p.IsMain).Url);})
            .ForMember(dest =>dest.RecipientPhotoUrl ,opt =>{opt.MapFrom(scr =>scr.Recipient.Photos.FirstOrDefault(p =>p.IsMain).Url);});
        }
    }
}