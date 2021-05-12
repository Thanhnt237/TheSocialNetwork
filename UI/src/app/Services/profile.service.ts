import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    readonly _baseProfileUrl = "http://localhost:8080/api/profile";
    readonly _editProfileUrl = "http://localhost:8080/api/edit-profile";

    constructor(
      private http: HttpClient,
      private _router: Router
    ) { }

    getUserProfile(userid: any){
      return this.http.get<any>(this._baseProfileUrl + userid);
    }

    getMyProfile(){
      return this.http.get<any>(this._baseProfileUrl);
    }

    editUserProfile(user: any){
      return this.http.post<any>(this._editProfileUrl, user);
    }
}
