import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  token: any = localStorage.getItem("token");

  chatSocket: any;
  leftSocket: any;
  rightSocket: any;

  readonly _rightNavUrl: string = "https://the-social-network1.herokuapp.com/api/right-nav"
  readonly _leftNavUrl: string = "https://the-social-network1.herokuapp.com/"
  readonly _chatUrl: string = "https://the-social-network1.herokuapp.com/api/chat"

  constructor(){
    this.leftSocket = io(this._leftNavUrl);
    this.rightSocket = io(this._rightNavUrl, {
      query: {
        token: this.token
      }
    });
  }

  StartChatConnection(){
    return this.chatSocket = io(this._chatUrl);
  }

  listenLeftNav(eventName: string){
    return Rx.Observable.create((subscriber:any)=>{
      this.leftSocket.on(eventName, (data: any)=>{
        subscriber.next(data);
      })
    });
  }

  listenFriendOnline(eventName: string){
    return Rx.Observable.create((subscriber:any)=>{
      this.rightSocket.on(eventName, (data: any)=>{
        subscriber.next(data);
      })
    });
  }

  RightNavEmit(eventName: string){
    this.rightSocket.emit(eventName);
  }

  chatEmit(eventName: string, data: any){
    this.chatSocket.emit(eventName, data);
  }


}
