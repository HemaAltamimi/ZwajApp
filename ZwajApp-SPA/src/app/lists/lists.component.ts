import { Component, OnInit } from '@angular/core';
import { User } from '../_models/User';
import { Pagination, PaginationResult } from '../_models/Pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users:User[];
pagination:Pagination;
likeParam:string;
search:boolean=false;
  constructor(private authService:AuthService,private userService:UserService,private route:ActivatedRoute,private alertify:AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data=>{
        this.users = data['users'].result;
        this.pagination= data['users'].pagination;
      }
    );
    this.likeParam='Likers';

  }
  loadUsers() {
    if (!this.search) {
      this.pagination.currentPage=1;
       }
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemPerPage,null,this.likeParam).subscribe((res: PaginationResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
      
    },
      error => this.alertify.error(error)
    );

}
pageChanged(event: any): void {
  this.pagination.currentPage = event.page;
  this.loadUsers();
}
}
