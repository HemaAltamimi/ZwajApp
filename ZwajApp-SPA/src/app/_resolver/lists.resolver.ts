import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { User } from "../_models/User";
import { UserService } from "../_services/User.service";
import { AlertifyService } from "../_services/alertify.service";
import { Observable,of } from "rxjs";
import { catchError  } from "rxjs/operators";

@Injectable()
export class ListResolver implements Resolve<User[]>{
    pageNumber = 1;
    pageSize = 6;
    likeParam = 'Likers';
    constructor(private userService:UserService,private router:Router,private alertify:AlertifyService){}
    resolve(route:ActivatedRouteSnapshot):Observable<User[]>{
        return this.userService.getUsers(this.pageNumber,this.pageSize,null,this.likeParam).pipe(
          catchError(error => {
              this.alertify.error('يوجد مشكلة في عرض البيانات');
              this.router.navigate(['']);
              return of(null);

          })  
        )
    }
}