import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  readonly _addCommentUrl = "https://the-social-network1.herokuapp.com/api/Comments/new/";
  readonly _getCommentUrl = "https://the-social-network1.herokuapp.com/api/Comment/getComment/";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  getAllComment(postId:any){
    return this.http.get<any>(this._getCommentUrl + postId)
  }

  AddNewComment(postId: any, comment: any){
    return this.http.post<any>(this._addCommentUrl + postId, comment);
  }
}
