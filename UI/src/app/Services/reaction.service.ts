import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  readonly _likeUrl = "https://the-social-network1.herokuapp.com/api/Like/like/";
  readonly _unLikeUrl = "https://the-social-network1.herokuapp.com/api/Like/unLike/";
  readonly _checkLikedUrl = "https://the-social-network1.herokuapp.com/api/Like/CheckLiked/";
  readonly _countLikedUrl = "https://the-social-network1.herokuapp.com/api/Like/CountLike/";

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
