import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../Services/auth.service";
import { ProfileService } from "../../Services/profile.service";

import { Router } from "@angular/router";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  userProfile = {
    userId: String,
    name: String
  };

  constructor(
    public _authService: AuthService,
    public _getUserId: ProfileService,
  ) { }

  ngOnInit(): void {
    this.refreshToolbar();
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

}
