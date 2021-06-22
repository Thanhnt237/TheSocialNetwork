import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  readonly _editProfileUrl = "https://the-social-network1.herokuapp.com//api/edit-profile";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  EditProfile(information: any){
    return this.http.post<any>(this._editProfileUrl, information)
  }
}
