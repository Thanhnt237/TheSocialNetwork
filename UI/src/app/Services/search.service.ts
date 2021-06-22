import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  readonly _searchUrl = "http://localhost:8080/api/SearchBarLoggedIn";
  readonly _searchNoLoginUrl = "http://localhost:8080/api/SearchBarNoLogin";
  readonly _searchHistoriesUrl = "http://localhost:8080/api/getSearchHistories";

  private searchInput = new BehaviorSubject(['Default message']);
  searchResult = this.searchInput.asObservable();

  constructor(
    private http: HttpClient,
    private _router: Router
  ) { }

  Search(search: any){
    return this.http.post<any>(this._searchUrl, search)
  }

  SearchNoLogin(search: any){
    return this.http.post<any>(this._searchNoLoginUrl, search)
  }

  getSearchHistories(){
    return this.http.get<any>(this._searchHistoriesUrl)
  }

  sendResult(result: any) {
    this.searchInput.next(result);
  }

}
