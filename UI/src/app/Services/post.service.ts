import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class PostService {

  readonly _postUrl = "http://localhost:8080/api/Post/new";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  AddNewPost(post: any){
    return this.http.post<any>(this._postUrl, post);
  }
}
