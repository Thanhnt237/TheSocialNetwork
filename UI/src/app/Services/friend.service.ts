import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  readonly _getFriendRequestUrl = "http://localhost:8080/api/Friend/getAllFriendRequest";
  readonly _sendFriendRequestUrl = "http://localhost:8080/api/Friend/FriendRequest/";
  readonly _getFriendUrl = "http://localhost:8080/api/Friend/getAllFriend";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  GetAllFriendRequest(){
    return this.http.get<any>(this._getFriendRequestUrl);
  }

  SendFriendRequest(userId: any, userSendId: any){
    return this.http.post<any>(this._sendFriendRequestUrl + userId, userSendId);
  }

  GetAllFriend(){
    return this.http.get<any>(this._getFriendUrl);
  }

}
