import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    readonly _baseToolbarUrl = "http://localhost:8080/api/toolbar-profile";
    readonly _baseProfileUrl = "http://localhost:8080/api/profile/";
    readonly _editProfileUrl = "http://localhost:8080/api/edit-profile";
    readonly _changeAvatarUrl = "http://localhost:8080/api/change-avatar";
    readonly _changeCoverUrl = "http://localhost:8080/api/change-cover";

    readonly _editDescriptionUrl = "http://localhost:8080/api/edit-profile/description";
    readonly _editNameUrl = "http://localhost:8080/api/edit-profile/name";
    readonly _editGenderUrl = "http://localhost:8080/api/edit-profile/gender";
    readonly _editDoBUrl = "http://localhost:8080/api/edit-profile/DoB";
    readonly _editAddressUrl = "http://localhost:8080/api/edit-profile/address";
    readonly _editPhoneUrl = "http://localhost:8080/api/edit-profile/phone";

    constructor(
      private http: HttpClient,
      private _router: Router
    ) { }

    getUserProfile(userid: any){
      return this.http.get<any>(this._baseProfileUrl + userid);
    }

    getToolbarProfile(){
      return this.http.get<any>(this._baseToolbarUrl);
    }

    editUserProfile(user: any){
      return this.http.post<any>(this._editProfileUrl, user);
    }

    ChangeAvatar(avatar: any){
      return this.http.post<any>(this._changeAvatarUrl, avatar);
    }

    ChangeCover(cover: any){
      return this.http.post<any>(this._changeCoverUrl, cover);
    }

    EditDescription(information: any){
        return this.http.post<any>(this._editDescriptionUrl, information);
    }
    EditName(information: any){
        return this.http.post<any>(this._editNameUrl, information);
    }
    EditGender(information: any){
        return this.http.post<any>(this._editGenderUrl, information);
    }
    EditDoB(information: any){
        return this.http.post<any>(this._editDoBUrl, information);
    }
    EditAddress(information: any){
        return this.http.post<any>(this._editAddressUrl, information);
    }
    EditPhone(information: any){
        return this.http.post<any>(this._editPhoneUrl, information);
    }
}
