import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

    readonly _resetPasswordUrl = "https://the-social-network1.herokuapp.com/api/reset";

    constructor(
      private http: HttpClient,
      private _router: Router
    ) { }

    resetPassword(user: any){
      return this.http.post<any>(this._resetPasswordUrl, user);
    }

}
