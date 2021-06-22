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
  readonly _acceptFriendUrl = "http://localhost:8080/api/Friend/AcceptFriend/";
  readonly _deleteFriendUrl = "http://localhost:8080/api/Friend/DeleteFriendRequest/";

  readonly _unFriendUrl = "http://localhost:8080/api/Friend/DeleteFriend/";
  readonly _getProfileFriend = "http://localhost:8080/api/Friend/getProfileFriend/";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  GetAllFriendRequest(){
    return this.http.get<any>(this._getFriendRequestUrl);
  }

  SendFriendRequest(userId: any, anything: any){
    return this.http.post<any>(this._sendFriendRequestUrl + userId,anything);
  }

  GetAllFriend(){
    return this.http.get<any>(this._getFriendUrl);
  }

  GetProfileFriend(userId: any){
    return this.http.get<any>(this._getProfileFriend + userId);
  }

  AcceptFriendRequest(friendQueue_ID: any, anything:any){
    return this.http.post<any>(this._acceptFriendUrl + friendQueue_ID, anything);
  }

  DeleteFriendRequest(friendQueue_ID: any, anything:any){
    return this.http.post<any>(this._deleteFriendUrl + friendQueue_ID, anything);
  }

  UnFriend(friendId:any,anything:any){
    return this.http.post<any>(this._unFriendUrl + friendId, anything);
  }


}
