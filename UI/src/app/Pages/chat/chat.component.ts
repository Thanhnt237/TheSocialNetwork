import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

import { WebsocketService } from "../../Services/websocket.service";
import { ProfileService } from "../../Services/profile.service";
import { ChatService } from "../../Services/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  title = 'app';

  message: FormControl = new FormControl('', [Validators.required, Validators.minLength(1),]);

  showSomething: any[] = [];
  you: any = {
    User_ID: String,
    name: String,
    avatar: String
  };
  friend: any ={
    User_ID: String,
    name: String,
    avatar: String
  };
  listMessages= {
    User_ID: String,
    Friend_ID:String,
    content: [{
      User_ID: String,
      content: String
    }]
  };

  messageFromClient: any;

  constructor(
    private _socket: WebsocketService,
    private _profile: ProfileService,
    private _chat: ChatService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params =>{
      let friendId = params.get('friendId');
      this._profile.getUserProfile(friendId)
        .subscribe(
          res=>{
            this.friend = res;
          },
          err=>{
            //console.log(err)
          }
        )
    })

    this._profile.getToolbarProfile()
      .subscribe(
        res=>{
          this.you = res;
        },
        err=>{
          //console.log(err);
        }
      )

      this._activatedRoute.paramMap.subscribe(params =>{
        let friendId = params.get('friendId');
        this._chat.GetChatForClient(friendId)
          .subscribe(
            res=>{
              this.listMessages = res;
              //console.log(this.listMessages)
            },
            err=>{
              //console.log(err)
            }
          )
      })

    this._socket.StartChatConnection();
  }

  SendMessage(){
    let userId = this._activatedRoute.snapshot.paramMap.get('friendId')
    this._chat.SendMessage(userId, {"message": this.message.value})
      .subscribe(
        res => {
          this.ngOnInit()
          this.message.reset();
        },
        err => {
          this.ngOnInit();
          this.message.reset();
        }
      )
  }

  isYou(message: any){
    if(message.User_ID == this.listMessages.User_ID){
      return true;
    }else{
      return false;
    }
  }

  isFriend(message: any){
    if(message.User_ID == this.listMessages.Friend_ID){
      return true;
    }else{
      return false;
    }
  }

  TypingEvent(){
  }

}
