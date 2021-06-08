import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

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


  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute

  ) { }

  NewsForm: FormGroup = this._formBuilder.group({
    content: new FormControl('', [Validators.required]),
    images: new FormControl('', [Validators.required])
  })


  ngOnInit(): void {
  }

  onAddNewNews(){

  }

  UploadImages(event: any){

  }
}
