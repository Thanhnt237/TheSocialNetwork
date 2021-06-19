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
import { CountService } from "../../Services/count.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  checkPermission: Boolean = false;
  date = new FormControl(new Date());
  openComment: Boolean = true;

  editBiology: Boolean = false;
  editName: Boolean = false;
  editGender: Boolean = false;
  editDoB: Boolean = false;
  editAddress: Boolean = false;
  editPhone: Boolean = false;

  countPost:Number = 0;
  countLike:Number = 0;
  countFriend:Number = 0;
  liked: boolean = true;
  likedColor:String = "green";
  PostForm: FormGroup;
  postNoImage = {
    "content": ""
  }
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
    "gender": "",
    name: String,
    phone: String
  };

  editProfile = {
    "address": "",
    "description": "",
    "gender":"",
    "name": "",
    "phone": ""
  }

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
      UserName: String,
      avatar: String,
      content: String
    }],
    isLiked: Boolean,
    like: 0,
    date: Date
  }]

  getProfileFriend = [{
    Friend_ID: String,
    avatar: String,
    name: String
  }]

  constructor(
    private _formBuilder: FormBuilder,
    private _profile: ProfileService,
    private _post: PostService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _auth: AuthService,
    private _comment: CommentService,
    private _friend: FriendService,
    private _reaction: ReactionService,
    private _count: CountService
  ) {
    this.PostForm = this._formBuilder.group({
      content: new FormControl('', [Validators.required]),
      images: new FormControl('', [Validators.required])
    })
   }

   CommentForm: FormGroup = this._formBuilder.group({
     content: new FormControl('', [Validators.required])
   })

   CheckGender(){
     if(this.userProfile.gender == "Nam"){
       return 0;
     }else if(this.userProfile.gender == "Nữ"){
       return 1;
     }else {
       return -1;
     }
   }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('userId');
      this._profile.getUserProfile(this.userId)
        .subscribe(
          res => {
            this.userProfile = res;
            //console.log(this.userProfile)
          },
          err=>{
            console.log(err);
          }
        )
      this._post.GetPost(this.userId)
        .subscribe(
          res => {
            this.getPost = res;
            this.getPost.forEach(post => {
              this._reaction.CheckLiked(post.Post_ID).subscribe(
                res => post.isLiked = res,
                err => console.log(err)
              )
              this._reaction.CountLike(post.Post_ID).subscribe(
                res => post.like = res,
                err => console.log(err)
              )
              this._comment.getAllComment(post.Post_ID).subscribe(
                res => post.Comments =res,
                err => console.log(err)
              )
            });
            console.log(res);
          },
          err=>{
            console.log(err);
          }
        )

      this._count.CountPost(this.userId).subscribe(
        res => this.countPost = res,
        err => console.log(err)
      )
      this._count.CountLike(this.userId).subscribe(
        res => this.countLike = res,
        err => console.log(err)
      )
      this._count.CountFriend(this.userId).subscribe(
        res => this.countFriend = res,
        err => console.log(err)
      )
      this._friend.GetProfileFriend(this.userId).subscribe(
        res => this.getProfileFriend = res,
        err => console.log(err)
      )
      this._profile.CheckPermission(this.userId).subscribe(
        res => this.checkPermission = res,
        err => console.log(err)
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
        this.ngOnInit()
      },
      err => {
        this.alertError = true;
        this.errCatching = err.error;
        console.log(this.errCatching);
        this.ngOnInit()
        this.CommentForm.reset()
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

    const formdata = new FormData();
    formdata.append('images', images)

    this._profile.ChangeAvatar(formdata)
      .subscribe(
        res => {
          console.log(res);
          let userId = this._activatedRoute.snapshot.paramMap.get('userId')
          this._router.navigateByUrl('/profile', { skipLocationChange: true }).then(() => {
              this._router.navigate([`/profile/${userId}`]);
          });
        },
        err => {
          this.ngOnInit()
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
          let userId = this._activatedRoute.snapshot.paramMap.get('userId')
          this._router.navigateByUrl('/profile', { skipLocationChange: true }).then(() => {
              this._router.navigate([`/profile/${userId}`]);
          });
        },
        err => {
          this.ngOnInit()
        }

      )
  }

  DeletePost(postId: any){
    this._post.DeletePost(postId)
      .subscribe(
        res => {
          console.log(res);
          let userId = this._activatedRoute.snapshot.paramMap.get('userId')
          this._router.navigateByUrl('/profile', { skipLocationChange: true }).then(() => {
              this._router.navigate([`/profile/${userId}`]);
          });
        },
        err => {
          this.ngOnInit()
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
          let userId = this._activatedRoute.snapshot.paramMap.get('userId')
          this._router.navigateByUrl('/profile', { skipLocationChange: true }).then(() => {
              this._router.navigate([`/profile/${userId}`]);
          });
        },
        err => {
          this.ngOnInit();
          this.PostForm.reset()
        }
      )
    })
  }

  PostNoImage(){
    this._activatedRoute.paramMap.subscribe(params=>{
      this._post.AddNewPostNoImage(params.get('userId'), this.postNoImage)
        .subscribe(
          res =>{
            console.log(res);
            let userId = this._activatedRoute.snapshot.paramMap.get('userId')
            this._router.navigateByUrl('/profile', { skipLocationChange: true }).then(() => {
                this._router.navigate([`/profile/${userId}`]);
            });
          },
          err =>{
            this.ngOnInit()
            this.postNoImage.content = ''
          }
        )

    })
  }

  EditDescription(){
    if(this._auth.loggedIn()){
      this._profile.EditDescription(this.editProfile)
      .subscribe(
        res=> console.log(res),
        err => {
          this.ngOnInit();
          this.editProfile.description = ''
          this.editBiology = !this.editBiology
        }
      )
    }
  }

  EditName(){
    if(this._auth.loggedIn()){
      this._profile.EditName({"name": this.editProfile.name})
      .subscribe(
        res=> console.log(res),
        err => {
          this.ngOnInit();
          this.editProfile.name = ''
          this.editName = !this.editName
        }
      )
    }
  }
  EditGender(){
    if(this._auth.loggedIn()){
      this._profile.EditGender({"gender": this.editProfile.gender})
      .subscribe(
        res=> console.log(res),
        err => {
          this.ngOnInit();
          this.editProfile.gender = ''
          this.editGender = !this.editGender
        }
      )
    }
  }
  EditDoB(){
    if(this._auth.loggedIn()){
      this._profile.EditDoB({"DoB": this.date.value})
      .subscribe(
        res=> console.log(res),
        err => {
          this.ngOnInit();
          this.date.reset();
          this.editDoB = !this.editDoB
        }
      )
    }
  }
  EditAddress(){
    if(this._auth.loggedIn()){
      this._profile.EditAddress({"address": this.editProfile.address})
      .subscribe(
        res=> console.log(res),
        err => {
          this.ngOnInit();
          this.editProfile.address = ''
          this.editAddress = !this.editAddress
        }
      )
    }
  }
  EditPhone(){
    if(this._auth.loggedIn()){
      this._profile.EditPhone({"phone": this.editProfile.phone})
      .subscribe(
        res=> console.log(res),
        err => {
          this.ngOnInit();
          this.editProfile.phone = ''
          this.editPhone = !this.editPhone
        }
      )
    }
  }

  LikePost(post: any){
    post.isLiked = !post.isLiked;
    post.like += 1;
    this._reaction.Like(post.Post_ID).subscribe(
      res => console.log(res),
      err => this.ngOnInit()
    )
  }

  unLikePost(post: any){
    post.isLiked = !post.isLiked;
    post.like -= 1;
    this._reaction.unLike(post.Post_ID).subscribe(
      res => console.log(res),
      err => this.ngOnInit()
    )
  }

  UnFriend(friendId:any){
    this._friend.UnFriend(friendId, "anything").subscribe(
      res => {
        this._router.navigateByUrl('/profile', { skipLocationChange: true }).then(() => {
            this._router.navigate([`/profile/${this.userId}`]);
        });
      },
      err => {
        this.ngOnInit()
      }
    )
  }


}
