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
  opened = true;

  alertError: boolean = false;
  errCatching = '';

  listUser: any[] = [];

  friendList = [{
    User_ID: String,
    name: String
  }]

  constructor(
      private _router: Router,
      public _authService: AuthService,
      private _friend: FriendService,
      private _websocketService: WebsocketService
  ) { }

  ngOnInit(): void {

    this._websocketService.listen("Server-Sent-UserOnline").subscribe((data:any)=>{
    this.listUser = data;
    console.log(this.listUser);
    })

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
