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
  socket: any;

  readonly _url: string = "localhost:8080"
  readonly _chatUrl: string = "localhost:8080/api/chat"

  constructor(){
    this.socket = io(this._url);

    this.chatSocket = io(this._chatUrl, {
      query: {
        token: this.token
      }
    });
  }

  listen(eventName: string){
    return Rx.Observable.create((subscriber:any)=>{
      this.socket.on(eventName, (data: any)=>{
        subscriber.next(data);
      })
    });
  }

  ChatListen(eventName: string){
    return Rx.Observable.create((subscriber:any)=>{
      this.chatSocket.on(eventName, (data: any)=>{
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data: any){
    this.socket.emit(eventName, data);
  }

  chatEmit(eventName: string, data: any){
    this.chatSocket.emit(eventName, data);
  }


}
