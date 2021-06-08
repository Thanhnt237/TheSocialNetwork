import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  readonly _likeUrl = "http://localhost:8080/api/Like/like/";
  readonly _unLikeUrl = "http://localhost:8080/api/Like/unLike/";
  readonly _checkLikedUrl = "http://localhost:8080/api/Like/CheckLiked/";
  readonly _countLikedUrl = "http://localhost:8080/api/Like/CountLike/";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  CountLike(postId: any){
    return this.http.get<any>(this._countLikedUrl + postId)
  }

  CheckLiked(postId: any){
    return this.http.get<any>(this._checkLikedUrl + postId)
  }

  Like(postId: any){
    return this.http.get<any>(this._likeUrl + postId)
  }

  unLike(postId: any){
    return this.http.get<any>(this._unLikeUrl + postId)
  }
}
