import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../Services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    alertError: boolean = false;
    errCatching = '';

    loginUserData = {
    'email': '',
    'password': ''
    };

    hide: boolean = true;

    constructor(
        private _formBuilder: FormBuilder,
        private _auth: AuthService,
        private _router: Router
    ) { }

    ngOnInit(): void {
    }

    loginForm: FormGroup = this._formBuilder.group({
        email : new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
      });

      onLogin() {
        if (!this.loginForm.valid) {
          return;
        }
        this.loginUser();
      }

      loginUser(){
      this.loginUserData = this.loginForm.value;
      this._auth.loginUser(this.loginUserData)
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
