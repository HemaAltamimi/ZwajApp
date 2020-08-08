import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { UserService } from "../_services/User.service";
import { AlertifyService } from "../_services/alertify.service";
import { Observable,of } from "rxjs";
import { catchError  } from "rxjs/operators";
import { Message } from "../_models/message";
import { AuthService } from "../_services/auth.service";

@Injectable()
export class MessageResolver implements Resolve<Message[]>{
    pageNumber =1 ;
    pageSize =6 ;
    messageType ="Unread" ;
    constructor(private authService:AuthService , private userService:UserService ,private router:Router,private alertify:AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot):Observable<Message[]> {
       return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumber ,this.pageSize,this.messageType).pipe(
           catchError(error =>{
               this.alertify.error('have error in Messages');
               this.router.navigate(['']);
               return of(null);
           })
       )
    }
}