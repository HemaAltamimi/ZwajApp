import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NEXT } from '@angular/core/src/render3/interfaces/view';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any ={};

  constructor(private authService:AuthService) { }

  ngOnInit() {
  }

  Login(){
    this.authService.login(this.model).subscribe(
      next => {console.log("Success Login")},
      error => console.error("Faild login")
      
    );
  }

  LoggedIn(){
    const token =localStorage.getItem('token');
    return !! token;
  }

  LoggedOut(){
    localStorage.removeItem('token');
    console.log("Sign Out");
  }

}
