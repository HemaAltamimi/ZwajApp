import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NEXT } from '@angular/core/src/render3/interfaces/view';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any ={};

  constructor(public authService:AuthService,private alertify:AlertifyService) { }

  ngOnInit() {
  }

  Login(){
    this.authService.login(this.model).subscribe(
      next => {this.alertify.success("Success Login")},
      error => this.alertify.error(error)
      
    );
  }

  LoggedIn(){
    return this.authService.loggedIn();
  }

  LoggedOut(){
    localStorage.removeItem('token');
    this.alertify.message("Sign Out");
  }

}
