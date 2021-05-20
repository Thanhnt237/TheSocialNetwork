import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../Services/auth.service";
import { ProfileService } from "../../Services/profile.service";
import { FriendService } from "../../Services/friend.service";

import { Router } from "@angular/router";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  noFriendQueue: boolean = false;
  noFriendQueueCatching = '';

  userProfile = {
    userId: String,
    name: String
  };

  friendRequest = [{
    User_ID: String,
    name: String
  }]



  constructor(
    public _authService: AuthService,
    public _getUserId: ProfileService,
    private _friend: FriendService
  ) { }

  ngOnInit(): void {
    this.refreshToolbar();
    this.getFriendRequest();
  }

  refreshToolbar(){
    this._getUserId.getToolbarProfile()
      .subscribe(
        res => {
          console.log(res);
          this.userProfile.userId = res.userId;
          this.userProfile.name = res.name;
          console.log(this.userProfile);
        },
        err=>{
          console.log(err);
        }
      )
  }

  getFriendRequest(){
    this._friend.GetAllFriendRequest()
      .subscribe(
        res=>{
          this.friendRequest = res;
        },
        err=>{
          this.noFriendQueue = true;
          this.noFriendQueueCatching = err.error;
          console.log(this.noFriendQueueCatching)
        }
      )
  }

}
