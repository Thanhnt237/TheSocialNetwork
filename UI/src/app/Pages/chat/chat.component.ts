import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  showSomething: any[] = [];
  you: any = {
    User_ID: String
  };
  friend: any ={
    User_ID: String,
    name: String,
    avatar: String
  };
  listMessages= {
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
            console.log(err)
          }
        )
    })

    this._profile.getToolbarProfile()
      .subscribe(
        res=>{
          this.you = res;
        },
        err=>{
          console.log(err);
        }
      )

      this._activatedRoute.paramMap.subscribe(params =>{
        let friendId = params.get('friendId');
        this._chat.GetChatForClient(friendId)
          .subscribe(
            res=>{
              this.listMessages = res;
              console.log(this.listMessages)
            },
            err=>{
              console.log(err)
            }
          )
      })

    this._socket.StartChatConnection();
  }

  SendMessage(data: any){
  }

  TypingEvent(){
  }

}
