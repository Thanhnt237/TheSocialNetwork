import { Component, OnInit } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { TestService } from "../../Services/test.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    private _router: Router,
    private _test: TestService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {

  }

  PostForm = {
    animal: String,
    fruit: String
  }

  TestForm: FormGroup = this._formBuilder.group({
      animal : new FormControl('', [Validators.required]),
      fruit: new FormControl('', [Validators.required])
  });

  onPostTest(){
    if (!this.TestForm.valid) {
      return;
    }
    this.PostTest();
  }

  PostTest(){
    this.PostForm = this.TestForm.value;
    this._test.PostTest(this.PostForm)
      .subscribe(
        res=>console.log(res),
        err=>console.log(err)
      )
  }

}
