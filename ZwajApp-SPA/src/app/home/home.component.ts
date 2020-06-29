import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode:boolean =false;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    //this.getValues();
  }

   registerToggle(){
     this.registerMode = true
   }

   
  /*getValues() {
    this.http.get('http://localhost:5000/api/WeatherForecast').subscribe(
      response=>{ this.value =response;},
      error=>{console.log(error);}
    )
  } */

  cancelRegister(mode:boolean){
    this.registerMode =mode;
  }
}
