import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  readonly _PostTestUrl = "https://the-social-network1.herokuapp.com/fortest";

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  PostTest(nature: any){
    return this.http.post<any>(this._PostTestUrl, nature)
  }
}
