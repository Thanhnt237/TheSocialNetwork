import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../Services/auth.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

      alertError: boolean = false;
      errCatching = '';

      UserData = {
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

      changePasswordForm: FormGroup = this._formBuilder.group({
          password: new FormControl('', [Validators.required, Validators.minLength(6)]),
          confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
        });

        onChangePassword() {
          if (!this.changePasswordForm.valid) {
            return;
          }
          this.registerUser();
        }

        registerUser(){
          if(this.changePasswordForm.value.password !== this.changePasswordForm.value.confirmPassword){
            this.alertError = true;
            this.errCatching = "Mật khẩu không trùng khớp";
          }else{
            this.UserData = this.changePasswordForm.value;
            this._auth.changePassword(this.UserData)
            .subscribe(
              res => {
                console.log(res);
                this._router.navigate(['/']);
              },
              err => {
                console.log(err);
                this._router.navigate(['/']);
            }
            )
          }
        }
}
