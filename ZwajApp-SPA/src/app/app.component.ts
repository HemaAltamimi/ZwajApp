import { Component, OnInit } from '@angular/core';
import{JwtHelperService} from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ZawajApp';
  jwtHelper =new  JwtHelperService();

/**
 *
 */
constructor(public authService:AuthService) {
   
}

  ngOnInit() {
    const token =localStorage.getItem('token');
    if(token){
      this.authService.decodedToken =this.jwtHelper.decodeToken(token);
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      this.authService.currentUser=user;
      this.authService.changeMemberPhoto(this.authService.currentUser.photoURL);
    }
  }
}
