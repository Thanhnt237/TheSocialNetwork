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
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TextareaAutosizeModule } from 'ngx-textarea-autosize';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { HomeComponent } from './Pages/home/home.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { ForgotPasswordComponent } from './Pages/forgot-password/forgot-password.component';
import { ResetConfirmComponent } from './Pages/reset-confirm/reset-confirm.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { AboutComponent } from './Pages/about/about.component';
import { FriendComponent } from './Pages/friend/friend.component';
import { NewsComponent } from './Pages/news/news.component';
import { ChatComponent } from './Pages/chat/chat.component';
import { EditProfileComponent } from './Pages/edit-profile/edit-profile.component';
import { SearchComponent } from './Pages/search/search.component';
import { ChatRoomComponent } from './Pages/chat-room/chat-room.component';


let angularMaterialModule = [
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  ReactiveFormsModule,
  MatDialogModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatTabsModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatTableModule,
  MatNativeDateModule,
  MatSelectModule,
  MatAutocompleteModule
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
    path:'profile/:userId',
    component: ProfileComponent
  },
  {
    path:'about',
    component: AboutComponent
  },
  {
    path:'friend',
    component: FriendComponent
  },
  {
    path:'search',
    component: SearchComponent
  },
  {
    path:'chat/:friendId',
    component: ChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'news',
    component: NewsComponent
  },
  {
    path:'setting',
    component: EditProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'chat-room',
    component: ChatRoomComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'**',
    component: HomeComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetConfirmComponent,
    ProfileComponent,
    AboutComponent,
    FriendComponent,
    NewsComponent,
    ChatComponent,
    SearchComponent,
    EditProfileComponent,
    ChatRoomComponent
  ],
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
    FormsModule,
    CommonModule,
    HttpClientModule,
    TextareaAutosizeModule,
    angularMaterialModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
