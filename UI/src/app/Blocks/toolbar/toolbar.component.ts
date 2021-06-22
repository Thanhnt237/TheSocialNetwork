import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { AuthService } from "../../Services/auth.service";
import { ProfileService } from "../../Services/profile.service";
import { FriendService } from "../../Services/friend.service";
import { CountService } from "../../Services/count.service";
import { SearchService } from "../../Services/search.service";
import { WebsocketService } from "../../Services/websocket.service";

import { Router } from "@angular/router";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  options: any = [{
    "content": ""
  }];

  searchForm = new FormControl();
  noFriendQueue: boolean = false;
  noFriendQueueCatching = '';

  checkResult: any;

  userProfile = {
    userId: String,
    name: String,
    avatar: String
  };

  friendRequest = [{
    User_ID: String,
    FriendQueue_ID: String,
    name: String,
    avatar: String
  }]

  constructor(
    public _authService: AuthService,
    public _getUserId: ProfileService,
    private _friend: FriendService,
    private _count: CountService,
    private _search: SearchService,
    private _socket: WebsocketService
  ) { }

  ngOnInit(): void {
    this.refreshToolbar();
    this.getFriendRequest();
    this.getSearchHistories();
    if(this._authService.loggedIn()){
      this._socket.RightNavEmit("Client-LoggedIn")
    }else{
      this._socket.RightNavEmit("disconnect")
    }
  }

  getSearchHistories(){
    this._search.getSearchHistories()
      .subscribe(
        res => this.options = res,
        err => {
          //console.log(err)
        }
      )
  }

  refreshToolbar(){
    this._getUserId.getToolbarProfile()
      .subscribe(
        res => {
          this.userProfile = res;
        },
        err=>{
          //console.log(err);
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
          //console.log(this.noFriendQueueCatching)
        }
      )
  }

  acceptFriendRequest(friendQueue_ID: any){
    this._friend.AcceptFriendRequest(friendQueue_ID, "anything")
      .subscribe(
        res => {
          window.location.reload()
        },
        err => {
          window.location.reload()
        }
      )
  }

  deleteFriendRequest(friendQueue_ID: any){
    this._friend.DeleteFriendRequest(friendQueue_ID, "anything")
      .subscribe(
        res => {
          window.location.reload()
        },
        err => {
          window.location.reload()
        }
      )
  }

  Search(){
    this._search.Search({"search": this.searchForm.value})
      .subscribe(
        res => {
          this.checkResult = res
          this._search.sendResult(this.checkResult)
        },
        err => {
          console.log(err)
          this.checkResult = [];
          this._search.sendResult(this.checkResult);
        }
      )
  }

  displayFn(user: any): string {
  return user && user.name ? user.name : '';
  }

  Logout(){
    this._authService.setOfflineState()
      .subscribe(
        res => {
          //console.log(res)
        },
        err => {
          //console.log(err)
        })

    this._authService.logoutUser();
  }

}
