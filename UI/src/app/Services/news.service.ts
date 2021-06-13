import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  readonly _checkAdminUrl = "http://localhost:8080/api/News/CheckAdmin"
  readonly _AddNewNewsUrl = "http://localhost:8080/api/News/new"
  readonly _AddNewNewsNoImageUrl = "http://localhost:8080/api/News/new/newsNoImage"
  readonly _getAllNewsUrl = "http://localhost:8080/api/News/getAllNews"

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  CheckAdmin(){
    return this.http.get<any>(this._checkAdminUrl)
  }

  AddNewNews(post:any){
    return this.http.post<any>(this._AddNewNewsUrl, post)
  }

  AddNewNewsNoImage(post:any){
    return this.http.post<any>(this._AddNewNewsNoImageUrl, post)
  }

  getAllNews(){
    return this.http.get<any>(this._getAllNewsUrl)
  }

}
