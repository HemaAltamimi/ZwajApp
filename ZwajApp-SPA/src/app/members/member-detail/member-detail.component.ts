import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { TabHeadingDirective, TabsetComponent } from 'ngx-bootstrap';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit,AfterViewChecked {

  @ViewChild('memberTabs') memberTabs:TabsetComponent;
 
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  paid:boolean=false;
  user:User;
  age:string;
  created:string;
  options ={weekDay:'long' ,year : 'numeric' ,month: 'long' ,day : 'numeric'}
  showIntro:boolean =true;
  showLook:boolean =true;
  constructor(private userService:UserService,private alertify:AlertifyService,private route:ActivatedRoute,private authService:AuthService) { }

  ngAfterViewChecked(): void {
    setTimeout(() => {
        this.paid =this.authService.paid;
    }, 0);
  }

  ngOnInit() {
    
    this.paid =this.authService.paid;
    // this.loadUser();
    this.route.data.subscribe(data =>{
      this.user =data['user'];
    });

    this.route.queryParams.subscribe(
      param => {
        const selectedTab = param['tab'];
        this.memberTabs.tabs[selectedTab>0?selectedTab:0].active =true;
      }
    )

    this.galleryOptions=[{
      width:'500px',
      height:'500px',
      imagePercent:100,
      thumbnailsColumns:4,
      imageAnimation:NgxGalleryAnimation.Slide,
      preview:false
    }]
    this.galleryImages=this.getImages();
    this.created = new Date(this.user.created).toLocaleString('ar-EG',this.options);
    this.age = this.user.age.toLocaleString('ar-EG');
    this.showIntro =true;
    this.showLook =true;
  }

  selectTab(tabId:number){
    this.memberTabs.tabs[tabId].active =true;
  }

  getImages(){
    const imageUrls=[];
    for(let i=0;i<this.user.photos.length;i++){
      imageUrls.push({
        small:this.user.photos[i].url,
        medium:this.user.photos[i].url,
        big:this.user.photos[i].url
      })
    }
    return imageUrls
  }
 
  deselect(){
    this.authService.hubConnection.stop();
  }

// loadUser(){
// this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
//   (user:User) =>{this.user =user} ,
//   error =>{this.alertify.error(error);}
// )
// }


}
