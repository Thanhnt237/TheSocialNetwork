import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AuthGuard } from "./Guard/auth.guard";

import { MatSidenavModule  } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from "@angular/forms";

import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { ResetConfirmComponent } from './Pages/reset-confirm/reset-confirm.component';
import { ProfileComponent } from './Pages/profile/profile.component';

let angularMaterialModule = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  ReactiveFormsModule
];

const routes: Routes = [
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'register',
    component: RegisterComponent
  },
  {
    path:'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path:'reset-confirm/:token',
    component: ResetConfirmComponent
  },
  {
    path:'profile/:userid',
    component: ResetConfirmComponent
  },
  {
    path:'**',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetConfirmComponent,
    ProfileComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    FormsModule,
    CommonModule,
    HttpClientModule,
    angularMaterialModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
