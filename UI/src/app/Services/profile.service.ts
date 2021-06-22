import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

    readonly _baseToolbarUrl = "https://the-social-network1.herokuapp.com/api/toolbar-profile";
    readonly _baseProfileUrl = "https://the-social-network1.herokuapp.com/api/profile/";
    readonly _editProfileUrl = "https://the-social-network1.herokuapp.com/api/edit-profile";
    readonly _changeAvatarUrl = "https://the-social-network1.herokuapp.com/api/change-avatar";
    readonly _changeCoverUrl = "https://the-social-network1.herokuapp.com/api/change-cover";

    readonly _editDescriptionUrl = "https://the-social-network1.herokuapp.com/api/edit-profile/description";
    readonly _editNameUrl = "https://the-social-network1.herokuapp.com/api/edit-profile/name";
    readonly _editGenderUrl = "https://the-social-network1.herokuapp.com/api/edit-profile/gender";
    readonly _editDoBUrl = "https://the-social-network1.herokuapp.com/api/edit-profile/DoB";
    readonly _editAddressUrl = "https://the-social-network1.herokuapp.com/api/edit-profile/address";
    readonly _editPhoneUrl = "https://the-social-network1.herokuapp.com/api/edit-profile/phone";

    readonly _checkPermissionUrl = "https://the-social-network1.herokuapp.com/api/profile/checkPermission/";

    constructor(
      private http: HttpClient,
      private _router: Router
    ) { }

    CheckPermission(userId: any){
        return this.http.get<any>(this._checkPermissionUrl + userId);
    }

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
