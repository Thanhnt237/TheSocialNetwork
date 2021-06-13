import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';

import { AboutService } from "../../Services/about.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private _about: AboutService,
  ) { }

  EditForm: FormGroup = this._formBuilder.group({
    name: "",
    phone: [""],
    address: [""],
    DoB: [""],
    description: [""],
    gender: [""]
  })

  ngOnInit(): void {
  }

  EditProfile(){
    console.log(this.EditForm.value)
    this._about.EditProfile(this.EditForm.value).subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }

}
