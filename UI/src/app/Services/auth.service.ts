import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  readonly _registerUrl = "https://the-social-network1.herokuapp.com/api/register";
  readonly _loginUrl = "https://the-social-network1.herokuapp.com/api/login";
  readonly _logoutUrl = "https://the-social-network1.herokuapp.com/api/logout";
  readonly _changePasswordUrl = "https://the-social-network1.herokuapp.com/api/change-password"

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  changePassword(password:any){
    return this.http.post<any>(this._changePasswordUrl, password);
  }

  registerUser(user: any){
    return this.http.post<any>(this._registerUrl, user);
  }

  loginUser(user: any){
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logoutUser(){
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  setOfflineState(){
    return this.http.get<any>(this._logoutUrl);
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
