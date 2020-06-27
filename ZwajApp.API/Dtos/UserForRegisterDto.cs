using System.ComponentModel.DataAnnotations;

namespace ZwajApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [StringLength(8,MinimumLength=4 ,ErrorMessage="min 4 max 8")]
        public string Password { get; set; }
    }
}