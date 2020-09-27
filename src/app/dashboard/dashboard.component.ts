import {Component, OnInit} from '@angular/core';
import {CommonService} from '../shared/services/common.service';

@Component({
  selector: 'ts-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private _common: CommonService) {
    this._common._router.navigate(['room', '5f6a08172d5b0a00131fafd5', 'zappy_test']);
  }

  ngOnInit() {

  }
}
