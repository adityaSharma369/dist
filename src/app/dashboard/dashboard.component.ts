import {Component, OnInit} from '@angular/core';
import {CommonService} from '../shared/services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'ts-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  analytics: any = {};
  today = '';
  yday = '';
  filterMode = 'today';

  constructor(private _common: CommonService) {
    this.today = moment().format('YYYY-MM-DD').toString();
    this.yday = moment().subtract(1, 'day').format('YYYY-MM-DD').toString();
  }

  ngOnInit() {
    this.getAnalytics(this.today, this.today);
  }

  getAnalytics(startDate, endDate) {
    const payload = {};
    this._common._api.post(this._common._api.apiUrl + '/reports/dashboard', payload).subscribe((resp) => {
      if (resp && resp.success) {
        this.analytics = resp.data || {};
      } else {
        this.analytics = {};
      }
    });
  }

  updateMode(mode) {
    this.filterMode = mode;
    let startDate;
    let endDate;
    if (mode === 'today') {
      startDate = this.today;
      endDate = this.today;
    } else if (mode === 'yday') {
      startDate = this.yday;
      endDate = this.yday;
    } else if (mode === 'custom') {
    }
    this.getAnalytics(startDate, endDate);
  }
}
