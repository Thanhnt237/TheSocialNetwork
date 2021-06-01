import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

import { ProfileService } from "../../Services/profile.service";
import { PostService } from "../../Services/post.service";
import { AuthService } from "../../Services/auth.service";
import { CommentService } from "../../Services/comment.service";
import { FriendService } from "../../Services/friend.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  alertError: boolean = false;
  errCatching = '';

  openComment: Boolean = true;

  liked: boolean = true;
  likedColor:String = "green";

  userProfile = {
    userId: String,
    name: String,
    avatar: String
  };

  getPost = [{
    UserName: String,
    Post_ID: String,
    UserAvatar: String,
    title: String,
    content: String,
    images: String,
    Comments: [{
      UserName: String,
      avatar: String,
      content: String
    }],
    like: Number,
    date: Date
  }]

  CommentForm: FormGroup = this._formBuilder.group({
    content: new FormControl('', [Validators.required])
  })

  constructor(
    private _formBuilder: FormBuilder,
    private _profile: ProfileService,
    private _post: PostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _auth: AuthService,
    private _comment: CommentService,
    private _friend: FriendService
  ) { }

  ngOnInit(): void {
    this._post.RenderHomePage().subscribe(
      res=>{
        this.getPost = res;
        console.log(this.getPost)
      },
      err=>{
        console.log(err)
      }
    )

    this.refreshToolbar();
  }

  refreshToolbar(){
    this._profile.getToolbarProfile()
      .subscribe(
        res => {
          this.userProfile = res;
        },
        err=>{
          console.log(err);
        }
      )
  }

  LikedColorChange(){
    this.liked = !this.liked;
    if(this.liked == true){
      this.likedColor = "basic"
    }
    else{
      this.likedColor = "primary"
    }
  }

  onAddNewComment(PostId: any){
    if (!this.CommentForm.valid) {
      return;
    }
    this.AddNewComment(PostId);
  }

  AddNewComment(PostId: any){
    this._comment.AddNewComment(PostId, this.CommentForm.value)
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
