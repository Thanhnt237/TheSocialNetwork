import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import {ResetConfirmService} from '../../Services/reset-confirm.service';

@Component({
  selector: 'app-reset-confirm',
  templateUrl: './reset-confirm.component.html',
  styleUrls: ['./reset-confirm.component.css']
})
export class ResetConfirmComponent implements OnInit {
  alertError: boolean = false;
  errCatching = '';

  userData = {
  'email': ''
  };

  constructor(
    private _rsCf: ResetConfirmService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) { }

  ResetPasswordForm: FormGroup = this._formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

  ngOnInit(): void {

  }

  onResetPassword() {
    if (!this.ResetPasswordForm.valid) {
      return;
    }
    this.ResetMyPassword();
  }

  ResetMyPassword(){
    this.userData = this.ResetPasswordForm.value;
    this._rsCf.PostNewPassword(this.userData)
    .subscribe(
      res => {
        console.log(res);
        this.alertError = true;
        this.errCatching = res;
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
