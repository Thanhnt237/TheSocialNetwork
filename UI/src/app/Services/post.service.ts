import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class PostService {

  readonly _addPostUrl = "https://the-social-network1.herokuapp.com/api/Post/new/";
  readonly _addPostNoImageUrl = "https://the-social-network1.herokuapp.com/api/Post/new/noImage/";
  readonly _deletePostUrl = "https://the-social-network1.herokuapp.com/api/Post/delete/"
  readonly _getPostUrl = "https://the-social-network1.herokuapp.com/api/Post/getPost/"
  readonly _homePageUrl = "https://the-social-network1.herokuapp.com/api/home"

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  AddNewPost(userId: any, post: any){
    return this.http.post<any>(this._addPostUrl + userId, post);
  }

  AddNewPostNoImage(userId:any, post:any){
    return this.http.post<any>(this._addPostNoImageUrl + userId, post);
  }

  GetPost(userId: any){
    return this.http.get<any>(this._getPostUrl + userId);
  }

  DeletePost(postId: any){
    return this.http.delete<any>(this._deletePostUrl + postId)
  }

  RenderHomePage(){
    return this.http.get<any>(this._homePageUrl)
  }

}
