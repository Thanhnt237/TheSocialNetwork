import { Component, OnInit } from '@angular/core';
import { SearchService } from "../../Services/search.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResult: any = [{
    DoB: String,
    address: String,
    avatar: String,
    cover: String,
    description: String,
    email: String,
    "gender": "",
    name: String,
    phone: String
  }];

  isSuccess: Boolean = false;

  constructor(
    private _search: SearchService
  ) { }

  ngOnInit(): void {
    this._search.searchResult.subscribe(
      result => {
        this.searchResult = result
        if(this.searchResult.length == 0){
          this.isSuccess = false;
        }else{
          this.isSuccess = true;
        }
      }
    )
  }

}
