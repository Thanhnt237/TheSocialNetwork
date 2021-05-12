import { Component, OnInit } from '@angular/core';

import { AuthService } from "../../Services/auth.service";
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(
    public _authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

}
