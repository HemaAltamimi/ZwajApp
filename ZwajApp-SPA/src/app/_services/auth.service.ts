import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import{JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import {BehaviorSubject} from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { element } from '@angular/core/src/render3/instructions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper =new  JwtHelperService();
constructor(private http:HttpClient) { }

baseUrl= environment.apiUrl +'Auth/';

decodedToken:any;

currentUser :User;

paid:boolean =false;

photoUrl = new BehaviorSubject<string>('../../assets/User.png');
currentPhotoUrl =this.photoUrl.asObservable();

unReadCount = new BehaviorSubject<string>('');
latestCount =this.unReadCount.asObservable();


hubConnection:HubConnection =new HubConnectionBuilder().withUrl("http://localhost:5000/chat").build();


login(model:any){
  return this.http.post(this.baseUrl + 'login' , model).pipe(
    map((response:any)=>{
      const user = response;
      if(user){
        localStorage.setItem('token',user.token);
        localStorage.setItem('user',JSON.stringify(user.user));
        this.decodedToken =this.jwtHelper.decodeToken(user.token);
        this.currentUser =user.user;
        this.changeMemberPhoto(this.currentUser.photoURL);
        console.log(this.decodedToken); 
      }
    })
  )

}

register(model: any){

  return this.http.post(this.baseUrl + 'register' , model);
}

loggedIn(){
  try{
    const token =localStorage.getItem('token');
    return ! this.jwtHelper.isTokenExpired(token) ;
  }
  catch{
    return false;
  }
  
}

changeMemberPhoto(newPhotoUrl:string){
  this.photoUrl.next(newPhotoUrl);
}

roleMatch(AllowedRoles:Array<string>) :boolean{
  let isMatch =false; 
  const userRoles =this.decodedToken.role as Array<string>;
  AllowedRoles.forEach(element =>{
    if(userRoles.includes(element)){
      isMatch=true;
      return;
    }
  });
  return isMatch;
}



}
