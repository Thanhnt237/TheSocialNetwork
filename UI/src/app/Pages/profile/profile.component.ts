import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

import { ProfileService } from "../../Services/profile.service";
import { PostService } from "../../Services/post.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  userId:any;

  alertError: boolean = false;
  errCatching = '';

  userProfile = {
    email: String,
    name: String,
    avatar: String
  };

  post = {
    content: String,
    image: File
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _profile: ProfileService,
    private _post: PostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      this._profile.getUserProfile(this.userId)
        .subscribe(
          res => {
            this.userProfile = res;
            console.log(res);
          },
          err=>{
            console.log(err);
          }
        )
    });
  }

  PostForm: FormGroup = this._formBuilder.group({
      content : new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required])
    });

  onAddNewPost(){
    if (!this.PostForm.valid) {
      return;
    }
    this.AddNewPost();
  }

  AddNewPost(){
    this.post = this.PostForm.value;
    this._post.AddNewPost(this.post)
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
        this.alertError = true;
        this.errCatching = err.error;
        console.log(this.errCatching);
      }
    )
  }

}
