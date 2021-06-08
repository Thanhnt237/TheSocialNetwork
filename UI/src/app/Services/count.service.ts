import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class CountService {
  readonly _countPostUrl = "http://localhost:8080/api/Count/CountPost/";
  readonly _countLikeUrl = "http://localhost:8080/api/Count/CountLike/";
  readonly _countFriendUrl = "http://localhost:8080/api/Count/CountFriend/";
  readonly _searchUrl = "http://localhost:8080/api/SearchBar";

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
  Search(search: any){
    return this.http.post<any>(this._searchUrl, search)
  }
}
