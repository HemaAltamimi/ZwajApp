import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../_models/User";
import { PaginationResult } from "../_models/Pagination";
import { map } from "rxjs/operators";
import { Message } from "../_models/message";

/*
const httpOption = {
  headers:new HttpHeaders(
    {
      'Authorization':'Bearer '+localStorage.getItem('token')
    }
  )
}
*/

@Injectable({
  providedIn: "root",
})
export class UserService {
  baseUrl = environment.apiUrl + "users/";

  constructor(private http: HttpClient) {}

  getUsers(
    page?,
    itemsPerPage?,
    userParams?,
    likeParam?
  ): Observable<PaginationResult<User[]>> {
    const paginationResult: PaginationResult<User[]> = new PaginationResult<
      User[]
    >();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append("PageNumber", page);
      params = params.append("PageSize", itemsPerPage);
    }

    if (userParams != null) {
      params = params.append("minAge", userParams.minAge);
      params = params.append("maxAge", userParams.maxAge);
      params = params.append("gender", userParams.gender);
      params = params.append("orderBy", userParams.orderBy);
    }
    if (likeParam === "Likers") {
      params = params.append("Likers", "true");
    }

    if (likeParam === "Likees") {
      params = params.append("Likees", "true");
    }

    return this.http
      .get<User[]>(this.baseUrl, { observe: "response", params })
      .pipe(
        map((response) => {
          paginationResult.result = response.body;

          if (response.headers.get("Pagination") != null) {
            paginationResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }

          return paginationResult;
        })
      );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + id);
  }

  updateUser(id: number, user: User) {
    console.log(id);
    console.log(user);
    return this.http.put(this.baseUrl + id, user);
  }

  setMainPhoto(userId: number, photoId: number) {
    return this.http.post(
      this.baseUrl + userId + "/photos/" + photoId + "/setMain",
      {}
    );
  }

  deletePhoto(userId: number, photoId: number) {
    return this.http.delete(this.baseUrl + userId + "/photos/" + photoId, {});
  }

  sendLike(id: number, recipientId: number) {
    return this.http.post(this.baseUrl + id + "/like/" + recipientId, {});
  }

  getMessages(id: number, page?, itemsPerPage?, messageType?) {
    const paginationResult: PaginationResult<Message[]> = new PaginationResult<Message[]>();
    let params = new HttpParams();
    params = params.append("messageType", messageType);
    if (page != null && itemsPerPage != null) {
      params = params.append("PageNumber", page);
      params = params.append("PageSize", itemsPerPage);
    }
    return this.http
      .get<Message[]>(this.baseUrl + id + "/messages", { observe: "response", params })
      .pipe(
        map((response) => {
          paginationResult.result = response.body;

          if (response.headers.get("Pagination") != null) {
            paginationResult.pagination = JSON.parse(
              response.headers.get("Pagination")
            );
          }

          return paginationResult;
        })
      );
  }


  getConversation(id:number ,reipientId:number){
    return this.http.get<Message[]>(this.baseUrl+id +'/messages/chat/'+reipientId);
  }

  sendMessage(id:number ,message:Message){
    return  this.http.post(this.baseUrl+id+'/Messages',message);
  }

  getUnreadCount(userId){
    return this.http.get(this.baseUrl+userId +"/messages/count");
  }

  markAsRead(userId:number,messageId:number){
    return this.http.post(this.baseUrl+userId+'/messages/read/'+messageId ,{}).subscribe();
  }

  deleteMessage(id:number,userId:number){
    return this.http.post(this.baseUrl+userId+"/messages/"+id,{});
  }

  charge(userId:number,stripToken:string){
    return this.http.post(this.baseUrl+ userId +'/charge/' +stripToken ,{});
  }

  getPaymentForUser(userId:number){
    return this.http.get(this.baseUrl + userId + '/payment');
  }
}
