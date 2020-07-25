using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ZwajApp.API.Helpers
{
    public static class Extensions
    {
         public static void AddApplicationError(this Microsoft.AspNetCore.Http.HttpResponse response,string message){

           response.Headers.Add("Application-Error",message);
           response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
           response.Headers.Add("Access-Control-Allow-Origin","*");

       }


       public static int CalculateAge(this DateTime datetime){
           var age = DateTime.Today.Year - datetime.Year ;
           if(datetime.AddYears(age) > DateTime.Today)
           {
               age--;
           }

           return age;
       }  


        public static void AddPagination(this Microsoft.AspNetCore.Http.HttpResponse response,int currentPage , int itemsPerPage , int totalItems, int totalPages){

           var paginationHeader = new PaginationHeader(currentPage,itemsPerPage,totalItems,totalPages);
           var camelCaseFormater =new JsonSerializerSettings();
           camelCaseFormater.ContractResolver = new CamelCasePropertyNamesContractResolver();
           response.Headers.Add("Pagination",JsonConvert.SerializeObject(paginationHeader,camelCaseFormater));
           response.Headers.Add("Access-Control-Expose-Headers","Pagination");

       }
    }
}