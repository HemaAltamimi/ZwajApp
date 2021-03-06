using System;
using System.Collections.Generic;

namespace ZwajApp.API.Dtos
{
    public class UserForListDto
    {
        public int Id { get; set; } 
        public string UserName { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public string Interests { get; set; }

        public string KnownAs { get; set; }
        public DateTime Created{set;get;}
        public DateTime LastActive { get; set; }
        public string City { get; set; }
        public string Country { get; set; } 
        public string PhotoURL { get; set; }
    }
}