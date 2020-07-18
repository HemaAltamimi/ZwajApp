using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helpers;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : ControllerBase
    {
        private readonly IZawajRepository _repo;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;

        public PhotosController(IZawajRepository repo, IOptions<CloudinarySettings> cloudinaryConfig, IMapper mapper)
        {
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;
            _repo = repo;

            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret);

            _cloudinary = new Cloudinary(account);
        }

        [ActionName("GetPhoto")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }
 
        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreateDto photoForCreateDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            var UserFromRepo = await _repo.GetUser(userId);
            var file = photoForCreateDto.File;
            var uploadResult = new ImageUploadResult();

            if (file != null && file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            photoForCreateDto.Url = uploadResult.Uri.ToString();
            photoForCreateDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreateDto);

            if (!UserFromRepo.Photos.Any(p => p.IsMain)) { photo.IsMain = true; }
            UserFromRepo.Photos.Add(photo);
            if (await _repo.SaveAll())
            {
                try
                {
                    var PhotoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                    //var x = CreatedAtRoute(routeName: nameof(GetPhoto), routeValues: new { id = photo.Id }, value: PhotoToReturn);
                    //var x = CreatedAtAction(actionName: "GetPhoto", controllerName: "Photos", routeValues: new {id = photo.Id }, value: PhotoToReturn);
                      var x = Created("http://localhost:5000/api/Users/"+userId+"/photos/"+photo.Id, value: PhotoToReturn);
                    return x;
                }
                catch (Exception e)
                {
                    throw e;
                }
            }   

            return BadRequest("خطأ في رفع الصورة");
        }
  
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int id ,int userId)
        {
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
             var UserFromRepo = await _repo.GetUser(userId);

             if(!UserFromRepo.Photos.Any(p => p.Id == id)) return Unauthorized();

             var DesierdMainPhoto = await _repo.GetPhoto(id);
             if(DesierdMainPhoto.IsMain) return BadRequest("هده الصوره الرئيسية");

             var currentMainPhoto = await _repo.GetMainPhotoForUSer(userId);
             currentMainPhoto.IsMain =false;
             DesierdMainPhoto.IsMain =true;
            if(await _repo.SaveAll())
              return NoContent();
             
              return BadRequest("حدث خطأ");
             
        }

        [HttpDelete("{id}/")]
        public async Task<IActionResult> DeletePhoto(int userId,int id)
        {
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
             var UserFromRepo = await _repo.GetUser(userId);

             if(!UserFromRepo.Photos.Any(p => p.Id == id)) return Unauthorized();

             var Photo = await _repo.GetPhoto(id);
             if(Photo.IsMain) return BadRequest("هده الصوره الرئيسية");
            
            if(Photo.PublicId != null){
                var deletionParams = new DeletionParams(Photo.PublicId);
               var result = _cloudinary.Destroy(deletionParams);
               if(result.Result =="ok"){
                     _repo.Delete(Photo);
               }
            }
            if(Photo.PublicId ==null){
                   _repo.Delete(Photo);
            }

            if(await _repo.SaveAll()){
                return Ok();
            }
            return BadRequest("Error Delete Photo");

        }
    }
}