import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
}) 
export class RegisterComponent implements OnInit {

  
  @Output() cancelRegister = new EventEmitter();
  model:any={};
  constructor(private authsSrvice:AuthService) { }

  ngOnInit() {
  }

  register(){
    console.log("register");
    this.authsSrvice.register(this.model).subscribe(()=> {console.log("register Successs")} , error =>{console.log(error)});
    
  }
  cancel(){
    this.cancelRegister.emit(false);
  }

}
