import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { ForgotPasswordService } from "../../Services/forgot-password.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

      alertError: boolean = false;
      errCatching = '';

      UserData = {
      'email': ''
      };

      hide: boolean = false;

      constructor(
          private _formBuilder: FormBuilder,
          private _reset: ForgotPasswordService,
          private _router: Router
      ) { }

      ngOnInit(): void {
      }

      resetPasswordForm: FormGroup = this._formBuilder.group({
          email : new FormControl('', [Validators.required, Validators.email]),
      });

      onResetPassword() {
          if (!this.resetPasswordForm.valid) {
            return;
          }
          this.ResetPassword();
        }

      ResetPassword(){
        this.UserData = this.resetPasswordForm.value;
        this._reset.resetPassword(this.UserData)
        .subscribe(
          res => {
            console.log(res);
            this.alertError = true;
            this.errCatching = res;
            console.log(this.errCatching);
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
