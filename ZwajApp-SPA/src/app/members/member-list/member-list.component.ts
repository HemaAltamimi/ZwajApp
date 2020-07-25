import { Component, OnInit } from "@angular/core";
import { User } from "../../_models/User";
import { UserService } from "../../_services/User.service";
import { AlertifyService } from "../../_services/alertify.service";
import { ActivatedRoute } from "@angular/router";
import { Pagination, PaginationResult } from "src/app/_models/Pagination";

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.css"],
})
export class MemberListComponent implements OnInit {
  users: User[];
  user :User = JSON.parse(localStorage.getItem('user'));
  genderList =[{value : 'رجل',display: 'رجال'},{value : 'إمرأة',display: 'نساء'}]
  pagination :Pagination;
  userParams : any ={};
  search:boolean=false;
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route:ActivatedRoute
  ) {}

  ngOnInit() {
    // this.loadUsers();
    this.search=false;
    this.route.data.subscribe(data =>{
      this.users =data['users'].result;
      this.pagination =data['users'].pagination;
    });
    this.userParams.gender =this.user.gender === 'رجل'? 'إمرأة' : 'رجل' ;
    this.userParams.minAge = 18 ;
    this.userParams.maxAge = 99 ;
    this.userParams.orderBy = 'lastActive' ;

  }

  resetFilter(){
    this.userParams.gender =this.user.gender === 'رجل'? 'إمرأة' : 'رجل' ;
    this.userParams.minAge = 18 ;
    this.userParams.maxAge = 99 ;
    this.userParams.orderBy = 'lastActive' ;
    this.loadUsers();
  }


  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  } 

  loadUsers() {
    if (!this.search) {
      this.pagination.currentPage=1;
       }
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemPerPage,this.userParams).subscribe((res: PaginationResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
      
    },
      error => this.alertify.error(error)
    );
  }
}
