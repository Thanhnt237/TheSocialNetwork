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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  openComment: Boolean = true;

  liked: boolean = true;
  likedColor:String = "green";
  PostForm: FormGroup;

  userId:any;

  alertError: boolean = false;
  errCatching = '';

  userProfile = {
    DoB: String,
    address: String,
    avatar: String,
    cover: String,
    description: String,
    email: String,
    gender:String,
    name: String,
    phone: String
  };

  post = {
    content: String,
    images: File
  }

  getPost = [{
    UserName: String,
    Post_ID: String,
    UserAvatar: String,
    title: String,
    content: String,
    images: String,
    Comments: [{
      User_ID: String,
      avatar: String,
      content: String
    }],
    like: Number,
    date: Date
  }]

  constructor(
    private _formBuilder: FormBuilder,
    private _profile: ProfileService,
    private _post: PostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _auth: AuthService,
    private _comment: CommentService,
    private _friend: FriendService

  ) {
    this.PostForm = this._formBuilder.group({
      content: new FormControl('', [Validators.required]),
      images: new FormControl('', [Validators.required])
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
            console.log(res);
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

  onAddNewFriend(){
      this._activatedRoute.paramMap.subscribe(params =>{
        this._friend.SendFriendRequest(params.get('userId'),"anything")
          .subscribe(
            res=>{
              console.log(res)
            },
            err=>{
              console.log(err)
            }
          )
      })
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

  changeAvatar(event: any){
    const images = event.target.files[0];
    console.log(images);

    const formdata = new FormData();
    formdata.append('images', images)

    this._profile.ChangeAvatar(formdata)
      .subscribe(
        res => {
          console.log(res);
          window.location.reload();
        },
        err => {
          console.log(err);
          window.location.reload();
        }

      )
  }

  changeCover(event: any){
    const images = event.target.files[0];

    const formdata = new FormData();
    formdata.append('images', images)

    this._profile.ChangeCover(formdata)
      .subscribe(
        res => {
          console.log(res);
          window.location.reload();
        },
        err => {
          console.log(err);
          window.location.reload();
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
          this._router.navigate(['/profile/'+params.get('userId')])
        },
        err => {
          console.log(err);
          this.alertError = true;
          this.errCatching = err.error;
          console.log(this.errCatching);
        }
      )
    })


  }

}
