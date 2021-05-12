import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResetConfirmService {

  readonly _baseResetConfirmUrl = "http://localhost:8080/reset-confirm/";

  constructor(
    private http: HttpClient
  ) { }


  getResetConfirm(token:any){
    return this.http.get<any>(this._baseResetConfirmUrl + token);
  }
  PostNewPassword(token:any, user: any){
    return this.http.post<any>(this._baseResetConfirmUrl + token, user);
  }

}
