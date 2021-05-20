import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket: any;
  readonly url: string = "localhost:8080"

  constructor(){
    this.socket = io(this.url);
  }

  listen(eventName: string){
    return Rx.Observable.create((subscriber:any)=>{
      this.socket.on(eventName, (data: any)=>{
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data: any){
    this.socket.emit(eventName, data);
  }


}
