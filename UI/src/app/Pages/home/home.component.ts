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
import { ReactionService } from "../../Services/reaction.service";

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
    isLiked: Boolean,
    like: 0,
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
    private _friend: FriendService,
    private _reaction: ReactionService
  ) { }

  ngOnInit(): void {
    this._post.RenderHomePage().subscribe(
      res=>{
        this.getPost = res;
        this.getPost.forEach(post => {
          this._reaction.CheckLiked(post.Post_ID).subscribe(
            res => post.isLiked = res,
            err => {
              //console.log(err)
            }
          )
          this._reaction.CountLike(post.Post_ID).subscribe(
            res => post.like = res,
            err => {
              //console.log(err)
            })
          this._comment.getAllComment(post.Post_ID).subscribe(
            res => post.Comments =res,
            err => {
              //console.log(err)
            })
        });
        //console.log(this.getPost)
      },
      err=>{
        //console.log(err)
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
          //console.log(err);
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

  DeletePost(postId: any){
    this._post.DeletePost(postId)
      .subscribe(
        res => {
          this.ngOnInit()
          //console.log(res);
        },
        err => {
          this.ngOnInit()
          //console.log(err);
        }
      )
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
        //console.log(res);
        this.ngOnInit()
      },
      err => {
        //console.log(err);
        this.alertError = true;
        this.errCatching = err.error;
        this.ngOnInit()
        //console.log(this.errCatching);
      }
    )
  }

  LikePost(post: any){
    post.isLiked = !post.isLiked;
    post.like += 1;
    this._reaction.Like(post.Post_ID).subscribe(
      res => {
        //console.log(res)
      },
      err => {
        //console.log(err)
      })
  }

  unLikePost(post: any){
    post.isLiked = !post.isLiked;
    post.like -= 1;
    this._reaction.unLike(post.Post_ID).subscribe(
      res => {
        //console.log(res)
      },
      err => {
        //console.log(err)
      })
  }

}
