import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from "../../Services/auth.service";
import { FriendService } from "../../Services/friend.service";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  opened = true;

  alertError: boolean = false;
  errCatching = '';

  friendList = [{
    User_ID: String,
    name: String
  }]

  constructor(
      private _friend: FriendService,
      private _router: Router,
      public _authService: AuthService
  ) { }

  ngOnInit(): void {
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
