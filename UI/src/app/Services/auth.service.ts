import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  readonly _registerUrl = "http://localhost:8080/api/register";
  readonly _loginUrl = "http://localhost:8080/api/login";
  readonly _logoutUrl = "http://localhost:8080/api/logout";
  readonly _changePasswordUrl = "http://localhost:8080/api/change-password"

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
