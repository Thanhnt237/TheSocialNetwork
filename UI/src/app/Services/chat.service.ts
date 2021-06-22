import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly _getChatForClient = "https://the-social-network1.herokuapp.com/api/Chat/";
  readonly _sendChatMessage = "https://the-social-network1.herokuapp.com/api/Chat/send-message/";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  GetChatForClient(userId:any){
    return this.http.get<any>(this._getChatForClient + userId)
  }

  SendMessage(userId: any, msg: any){
    return this.http.post<any>(this._sendChatMessage + userId, msg)
  }

}
