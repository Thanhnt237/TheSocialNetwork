import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class CountService {
  readonly _countPostUrl = "https://the-social-network1.herokuapp.com/api/Count/CountPost/";
  readonly _countLikeUrl = "https://the-social-network1.herokuapp.com/api/Count/CountLike/";
  readonly _countFriendUrl = "https://the-social-network1.herokuapp.com/api/Count/CountFriend/";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  CountPost(userId: any){
    return this.http.get<any>(this._countPostUrl + userId)
  }
  CountLike(userId: any){
    return this.http.get<any>(this._countLikeUrl + userId)
  }
  CountFriend(userId: any){
    return this.http.get<any>(this._countFriendUrl + userId)
  }
}
