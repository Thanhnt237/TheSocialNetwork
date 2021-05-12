import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../Services/auth.service";
import { ProfileService } from "../../Services/profile.service";

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
    this._getUserId.getMyProfile()
      .subscribe(
        res => {
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
