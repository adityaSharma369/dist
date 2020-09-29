import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../shared/services/common.service';

@Component({
  selector: 'ts-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

  constructor(
    public _common: CommonService
  ) {
  }

  ngOnInit() {
  }

}
