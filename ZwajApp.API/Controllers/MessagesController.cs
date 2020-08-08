using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helpers;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [ApiController]
    [Route("api/users/{userId}/[controller]")]
    public class MessagesController: ControllerBase
    {
        private readonly IZawajRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IZawajRepository repo, IMapper mapper)
        {
            this._mapper = mapper;
            this._repo = repo;
        }

        [HttpGet("{id}",Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId,int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            var messageFromRepo =await _repo.GetMessage(id);
            if(messageFromRepo == null) return BadRequest("لا توجد رسالة");
            
            return Ok(messageFromRepo);
        }


        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId,[FromQuery]MessageParams messageParams)
        {
              if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

              messageParams.UserId =userId;
              var messagesFromRepo =await _repo.GetMessagesForUser(messageParams);
              var messages= _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);
              Response.AddPagination(messagesFromRepo.CurrentPage ,messagesFromRepo.PageSize ,messagesFromRepo.TotalCount ,messagesFromRepo.TotalPages);
              return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId,MessageForCreationDto messageForCreationDto)
        {
            var sender = await _repo.GetUser(userId);
              if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

              messageForCreationDto.SenderId =userId;
              var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);
              if(recipient == null) return BadRequest("لم يتم الوصول للمرسل اليه");
              var message =_mapper.Map<Message>(messageForCreationDto);
              _repo.Add(message);
              if(await _repo.SaveAll()){  
                var messageToReturn = _mapper.Map<MessageToReturnDto>(message);
                return Ok(messageToReturn);
                //return CreatedAtRoute("GetMessage",new {controller = "Messages",id=message.Id},message);
              }

              return BadRequest();
        }

        [HttpGet("chat/{recipientId}")]
        public async Task<IActionResult> GetConvarsation(int userId , int recipientId)
        {
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();
             var messagesFromRepo = await _repo.GetConvarsation(userId,recipientId);
             var messages= _mapper.Map<IEnumerable<MessageToReturnDto>>(messagesFromRepo);
             return Ok(messages);
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetUnreadMessagesForUser(int userId){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            var count = await _repo.GetUnreadMessagesForUser( int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
            return Ok(count);
        }


        [HttpPost("read/{id}")]
        public async Task<IActionResult> MarkMessageAsRead(int userId,int id){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();
             var message = await _repo.GetMessage(id);
             if(message.RecipientId != userId)
                 return Unauthorized();
            message.IsRead = true;
            message.DateRead=DateTime.Now;
            await _repo.SaveAll();
            return NoContent();
       }

       [HttpPost("{id}")]
       public async Task<IActionResult> DeleteMessage(int id,int userId)
       {
           if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();
           var message = await _repo.GetMessage(id);

           if(message.SenderId == userId)
            message.SenderDeleted =true;

           if(message.RecipientId == userId)
            message.RecipientDeleted =true;

            if(message.SenderDeleted && message.RecipientDeleted)
             _repo.Delete(message);
            
            if(await _repo.SaveAll())
            return NoContent();

            throw new Exception("has error in delete message");

       }

    }
}