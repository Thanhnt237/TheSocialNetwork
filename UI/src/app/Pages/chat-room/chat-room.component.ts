import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

import { WebsocketService } from "../../Services/websocket.service";
import { ProfileService } from "../../Services/profile.service";
import { ChatService } from "../../Services/chat.service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

  you: any = {
    User_ID: String,
    name: String,
    avatar: String
  };

  avatar: any = []
  message: any = [];

  clientMessage: any = [];

  constructor(
    private _socket: WebsocketService,
    private _profile: ProfileService,
    private _chat: ChatService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._profile.getToolbarProfile()
      .subscribe(
        res=>{
          this.you = res;
        },
        err=>{
          //console.log(err);
        }
      )

    this._socket.listen("Server-Reply-Avatar").subscribe((data:any)=>{
      this.avatar = data
    })

    this._socket.listen("Server-Reply-Message").subscribe((data:any)=>{
      this.message = data
    })

  }

  SendMessage(){
    if(this.clientMessage != ""){
      this._socket.emit("CLIENT-SENT-avatar",this.you.avatar)
      this._socket.emit("CLIENT-SENT-message",this.clientMessage)
      this.clientMessage = ""
    }
  }



}
