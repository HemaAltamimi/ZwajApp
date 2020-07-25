using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helpers;

namespace ZwajApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IZawajRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IZawajRepository repo, IMapper mapper)
        {
            this._mapper = mapper;
            this._repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId =int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var UserFromRepo =await _repo.GetUser(currentUserId);
            userParams.UserId =currentUserId;
            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender = UserFromRepo.Gender == "رجل" ? "إمرأة"  : "رجل";
            }
            var users = await _repo.GetUsers(userParams);
            var usersToReturn=_mapper.Map<IEnumerable<UserForListDto>>(users);

            //Add Header
            Response.AddPagination(users.CurrentPage ,users.PageSize ,users.TotalCount,users.TotalPages);
            return Ok(usersToReturn);
        }

        [HttpGet("{id}",Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            if (user == null) return BadRequest("لا يوجد مستخدم");

            var userToReturn=_mapper.Map<UserForDetailsDto>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id , UserForUpdateDto userForUpdateDto)
        {
            if(id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) return Unauthorized();

            var UserFromRepo =await _repo.GetUser(id);
            _mapper.Map(userForUpdateDto,UserFromRepo);
            if(await _repo.SaveAll()){
                return NoContent();
            }

            throw new System.Exception($"حدثت مشكلة في التعديل") ;       
        }
    }
}