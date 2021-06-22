import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from "../../Services/auth.service";
import { FriendService } from "../../Services/friend.service";
import { WebsocketService } from "../../Services/websocket.service";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  rightOpened = true;
  leftOpened = true;

  time: any;
  date:any;

  temperature: any = '0';
  humidity:any = '0';
  rainState: any = '0';
  UVLevel: any = '0';
  plasticBottle: any = '5';

  alertError: boolean = false;
  errCatching = '';

  listUser: any[] = [];

  friendList = [{
    User_ID: String,
    Friend_ID: String,
    avatar: String,
    name: String
  }]

  constructor(
      private _router: Router,
      public _authService: AuthService,
      private _friend: FriendService,
      private _websocketService: WebsocketService
  ) { }

  ngOnInit(): void {

    this._websocketService.listenFriendOnline("Server-Sent-UserOnline").subscribe((data:any)=>{
    this.listUser = data;
    })

    this._websocketService.listenLeftNav("Server-Sent-Time").subscribe((data:any)=>{
    this.time = data;
    })

    this._websocketService.listenLeftNav("Server-Sent-Date").subscribe((data:any)=>{
    this.date = data;
    })

    this._websocketService.listenLeftNav("Server-Sent-Temperature").subscribe((data:any)=>{
    this.temperature = data;
    })

    this._websocketService.listenLeftNav("Server-Sent-Humidity").subscribe((data:any)=>{
    this.humidity = data;
    })

    this._websocketService.listenLeftNav("Server-Sent-UVLevel").subscribe((data:any)=>{
    this.UVLevel = data;
    })

    this._websocketService.listenLeftNav("Server-Sent-Value").subscribe((data:any)=>{
    this.plasticBottle = data;
    })

    //this._websocketService.listenLeftNav("Server-Sent-Value").subscribe((data:any)=>{
    //this.plasticBottle = data;

    this.getAllFriend();
  }

  getAllFriend(){
    this._friend.GetAllFriend()
      .subscribe(
        res =>{
          this.friendList = res;
        },
        err =>{
          this.alertError = true;
          this.errCatching = err.error
        }
      )
  }

}
