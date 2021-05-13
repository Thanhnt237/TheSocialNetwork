import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';

import { ProfileService } from "../../Services/profile.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userId:any

  userProfile = {
    name: String
  };

  constructor(
    private _profile: ProfileService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      this._profile.getUserProfile(this.userId)
        .subscribe(
          res => {
            console.log(res);
          },
          err=>{
            console.log(err);
          }
        )
    });

  }
}
