import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly _getChatForClient = "http://localhost:8080/api/Chat/";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  GetChatForClient(userId:any){
    return this.http.get<any>(this._getChatForClient + userId)
  }

}
