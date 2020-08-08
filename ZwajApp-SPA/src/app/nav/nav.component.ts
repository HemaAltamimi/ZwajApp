import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_services/auth.service";
import { NEXT } from "@angular/core/src/render3/interfaces/view";
import { AlertifyService } from "../_services/alertify.service";
import { Router } from "@angular/router";
import { UserService } from "../_services/User.service";
import { HubConnection, HubConnectionBuilder } from "@aspnet/signalr";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"],
})
export class NavComponent implements OnInit {
  model: any = {};

  photoUrl: string;

  hubConnection: HubConnection;

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private userService: UserService
  ) {}

  count: string;

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );

    this.userService
      .getUnreadCount(this.authService.decodedToken.nameid)
      .subscribe((data) => {
        this.authService.unReadCount.next(data.toString());
        this.authService.unReadCount.subscribe((res) => {
          this.count = res;
        });
      });
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat")
      .build();
    this.hubConnection.start();
    this.hubConnection.on("count", () => {
      setTimeout(() => {
        this.userService
          .getUnreadCount(this.authService.decodedToken.nameid)
          .subscribe((res) => {
            this.authService.unReadCount.next(res.toString());
            this.authService.latestCount.subscribe((res) => {
              this.count = res;
            });
          });
      }, 0);
    });
  }

  Login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        this.alertify.success("Success Login");
        this.userService
          .getUnreadCount(this.authService.decodedToken.nameid)
          .subscribe((res) => {
            this.authService.unReadCount.next(res.toString());
            this.authService.latestCount.subscribe((res) => {
              this.count = res;
            });
          });
      },
      (error) => this.alertify.error(error),
      () => {
        this.router.navigate(["/members"]);
      }
    );
  }

  LoggedIn() {
    return this.authService.loggedIn();
  }

  LoggedOut() {
    localStorage.removeItem("token");
    this.authService.decodedToken = null;
    localStorage.removeItem("user");
    this.authService.currentUser = null;
    this.alertify.message("Sign Out");
    this.router.navigate([""]);
  }
}
