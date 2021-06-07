import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class PostService {

  readonly _addPostUrl = "http://localhost:8080/api/Post/new/";
  readonly _addPostNoImageUrl = "http://localhost:8080/api/Post/new/noImage/";
  readonly _deletePostUrl = "http://localhost:8080/api/Post/delete/"
  readonly _getPostUrl = "http://localhost:8080/api/Post/getPost/"
  readonly _homePageUrl = "http://localhost:8080/api/home"

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
