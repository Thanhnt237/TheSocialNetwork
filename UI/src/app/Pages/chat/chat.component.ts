import { Component, OnInit } from '@angular/core';
import { WebsocketService } from "../../Services/websocket.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  title = 'app';

  showSomething: any[] = [];
  listUser: any[] = [];
  listMessages: any[] = [];
  messageFromClient: any;

  constructor(private websocketService: WebsocketService) { }

  ngOnInit(): void {
    this.websocketService.listen("Server-reply-message").subscribe((data:any)=>{
    this.listMessages.push(data);
    this.messageFromClient = '';
    console.log(this.listMessages);
  })

  this.websocketService.listen("Server-sent-userName").subscribe((data:any)=>{
  this.listUser = data;
  console.log(this.listUser);
  })

  this.websocketService.listen("Server-sent-data").subscribe((data:any)=>{
  this.showSomething.push(data);
  console.log(this.showSomething);
  })
  }

  SendMessage(data: any){
  this.websocketService.emit("Client-sent-Message", data);
  }

  TypingEvent(){
  this.websocketService.emit("Client-is-typing", " is typing...")
  }

}
