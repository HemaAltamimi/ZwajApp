import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NEXT } from '@angular/core/src/render3/interfaces/view';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any ={};
 
  photoUrl:string ;
  constructor(public authService:AuthService,private alertify:AlertifyService ,private router:Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      photoUrl => this.photoUrl= photoUrl 
    )
  }

  Login(){
    this.authService.login(this.model).subscribe(
      next => {this.alertify.success("Success Login")},
      error => this.alertify.error(error),
      () =>{this.router.navigate(['/members'])} 
      
    );
  }

  LoggedIn(){
    return this.authService.loggedIn();
  }

  LoggedOut(){
    localStorage.removeItem('token');
    this.authService.decodedToken =null;
    localStorage.removeItem('user');
    this.authService.currentUser=null;
    this.alertify.message("Sign Out");
    this.router.navigate(['']);
  }

}