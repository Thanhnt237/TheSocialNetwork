import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

import { ProfileService } from "../../Services/profile.service";
import { PostService } from "../../Services/post.service";
import { AuthService } from "../../Services/auth.service";
import { CommentService } from "../../Services/comment.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  openComment: Boolean = true;

  liked: boolean = true;
  likedColor:String = "basic";
  PostForm: FormGroup;

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
    images: File
  }

  getComment = [{
    content: String
  }]

  getPost = [{
    UserName: String,
    Post_ID: String,
    UserAvatar: String,
    title: String,
    content: String,
    images: String
  }]

  constructor(
    private _formBuilder: FormBuilder,
    private _profile: ProfileService,
    private _post: PostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _auth: AuthService,
    private _comment: CommentService

  ) {
    this.PostForm = this._formBuilder.group({
      content: [''],
      images: [null]
    })
   }

   CommentForm: FormGroup = this._formBuilder.group({
     content: new FormControl('', [Validators.required])
   })

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      this._profile.getUserProfile(this.userId)
        .subscribe(
          res => {
            this.userProfile = res;
          },
          err=>{
            console.log(err);
          }
        )
      this._post.GetPost(this.userId)
        .subscribe(
          res => {
            this.getPost = res;
            console.log(this.getPost);
          },
          err=>{
            console.log(err);
          }
        )

    });
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

  onAddNewPost(){
    if (!this.PostForm.valid) {
      return;
    }
    this.AddNewPost();
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

  UploadImages(event:any){
    const file = event.target.files[0];
      this.PostForm.patchValue({
        images: file
      })
  }
  //// TODO: Chờ fix cái củ cải này
  onLoadComment(post: any){
    this._comment.GetAllComment(post.Post_ID)
      .subscribe(
        res => {
          this.getComment = res;
          console.log(this.getComment)
        },
        err =>{
          console.log(err);
        }

      )
  }

  AddNewPost(){
    const PostFormData = new FormData();
    PostFormData.append('images',this.PostForm.value.images);
    PostFormData.append('content',this.PostForm.value.content);
    console.log(PostFormData);
    this._activatedRoute.paramMap.subscribe(params=>{
      this._post.AddNewPost(params.get('userId'), PostFormData)
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
    })

    window.location.reload();
  }

}
