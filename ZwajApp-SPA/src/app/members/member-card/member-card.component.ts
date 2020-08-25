import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { error } from 'protractor';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

@Input() user:User ;

  constructor(private authService:AuthService,private userService:UserService ,private alertify:AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id:number){
    this.userService.sendLike(this.authService.decodedToken.nameid,id).subscribe(
      () => {this.alertify.success('لقد قمت بالاعجاب'+this.user.knownAs);},
      error => {this.alertify.error(error);}
    )
  }

}
