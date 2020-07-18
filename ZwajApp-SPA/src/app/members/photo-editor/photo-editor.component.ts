import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Photo } from "src/app/_models/Photo";
import { FileUploader } from "ng2-file-upload";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/_services/auth.service";
import { UserService } from "src/app/_services/User.service";
import { AlertifyService } from "src/app/_services/alertify.service";
import { User } from "src/app/_models/User";
import { ActivatedRoute } from "@angular/router";
import { findIndex } from "rxjs/operators";

@Component({
  selector: "app-photo-editor",
  templateUrl: "./photo-editor.component.html",
  styleUrls: ["./photo-editor.component.css"],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange =new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Photo;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.initializeUploader();

    // this.route.data.subscribe((data) => {
    //   this.user = data["user"];
    // });
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        "users/" +
        this.authService.decodedToken.nameid +
        "/photos",
      authToken: "Bearer " + localStorage.getItem("token"),
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, Response, status, headers) => {
      if (Response) {
        const res: Photo = JSON.parse(Response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          isMain: res.isMain,
        };
        this.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          this.currentMain = this.photos.filter((p) => p.isMain === true)[0];
          this.currentMain.isMain = false;
          photo.isMain = true;
          this.alertifyService.success("تم تعيين الصورة بنجاح");
          // this.user.photoURL = photo.url;

            //this.getMemberPhotoChange.emit( photo.url);

          this.authService.changeMemberPhoto( photo.url);
          this.authService.currentUser.photoURL=photo.url;
          localStorage.setItem('user',JSON.stringify(this.authService.currentUser));
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
  }

  deletePhoto(photo:Photo){

    this.alertifyService.confirm("هل تريد حذف هذه الصورة",
    ()=> {
      this.userService.deletePhoto(this.authService.decodedToken.nameid, photo.id).
      subscribe(
        () => {
          this.photos.splice(this.photos.findIndex(p => p.id === photo.id),1);
          this.alertifyService.success("تم حذف اصورة بنجاح");
        },
        (error) => {
          this.alertifyService.error(error);
        }
      );
    },
    () =>{});

   
    
  }
}
