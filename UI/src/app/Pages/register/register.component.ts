import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../Services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    alertError: boolean = false;
    errCatching = '';

    registerUserData = {
    'name': '',
    'email': '',
    'password': '',
    'confirmPassword': ''
    };

    hide: boolean = true;

    constructor(
      private _auth: AuthService,
      private _router: Router,
      private _formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
    }

    registerForm: FormGroup = this._formBuilder.group({
        name : new FormControl('', [Validators.required]),
        email : new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
      });

      onRegister() {
        if (!this.registerForm.valid) {
          return;
        }
        this.registerUser();
      }

      registerUser(){
        if(this.registerForm.value.password !== this.registerForm.value.confirmPassword){
          this.alertError = true;
          this.errCatching = "Mật khẩu không trùng khớp";
        }else{
          this.registerUserData = this.registerForm.value;
          this._auth.registerUser(this.registerUserData)
          .subscribe(
            res => {
              console.log(res);
              localStorage.setItem('token', res.token);
              window.location.replace('/')
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


}
