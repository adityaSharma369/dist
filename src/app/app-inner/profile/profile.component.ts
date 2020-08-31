import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../shared/services/common.service';

@Component({
  selector: 'ts-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public _common: CommonService) {
    this._common._data.pageTitle = 'Profile';
  }

  ngOnInit() {
  }

}
