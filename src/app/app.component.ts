import { Component, OnInit } from '@angular/core';
// import * as chrome from 'chrome';

// import chrome from 'chrome'
// import { chrome } from 'chrome';
// declare var chrome : Chrome;
declare var chrome : any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'task-1';
  currentTabData: any;

  constructor() {

  }

  ngOnInit(): void {

  }

}
