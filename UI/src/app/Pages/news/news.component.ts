import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

import { NewsService } from "../../Services/news.service";
import { AuthService } from "../../Services/auth.service";
import { ProfileService } from "../../Services/profile.service";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  isAdmin: Boolean = false;

  newsNoImage = {
    "content": ""
  }

  getPost = [{
    UserName: String,
    User_ID: String,
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

  userProfile = {
    userId: String,
    name: String,
    avatar: String
  };


  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    public _auth: AuthService,
    private _news: NewsService,
    private _profile: ProfileService
  ) { }

  NewsForm: FormGroup = this._formBuilder.group({
    content: new FormControl('', [Validators.required]),
    images: new FormControl('', [Validators.required])
  })


  ngOnInit(): void {
    this.getAdminProfile()
    this.CheckAdmin()
    this.getAllNews();
  }

  onAddNewNews(){
    if (!this.NewsForm.valid) {
      return;
    }
    this.AddNewNews();
  }

  AddNewNews(){
    const NewsFormData = new FormData();
    NewsFormData.append('images',this.NewsForm.value.images);
    NewsFormData.append('content',this.NewsForm.value.content);
    if(this.isAdmin){
      this._news.AddNewNews(NewsFormData)
        .subscribe(
          res => this.ngOnInit(),
          err => this.ngOnInit()
        )
    }
  }


  getAllNews(){
    this._news.getAllNews()
      .subscribe(
        res => this.getPost = res,
        err => {
          //console.log(err)
        })
  }

  getAdminProfile(){
    this._profile.getToolbarProfile()
      .subscribe(
        res => this.userProfile = res,
        err => {
          //console.log(err)
        })
  }

  CheckAdmin(){
    if(this._auth.loggedIn()){
      this._news.CheckAdmin()
      .subscribe(
        res => this.isAdmin = res,
        err => {
          //console.log(err)
        })
    }
  }

  NewsNoImage(){
    this._news.AddNewNewsNoImage(this.newsNoImage)
      .subscribe(
        res => {
          this.ngOnInit()
          this.newsNoImage.content = ""
        },
        err => {
          this.ngOnInit()
          this.newsNoImage.content = ""
        }
      )
  }

  UploadImages(event: any){
    const file = event.target.files[0];
      this.NewsForm.patchValue({
        images: file
      })
  }
}
