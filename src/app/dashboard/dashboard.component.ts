import {Component, OnInit} from '@angular/core';
import {CommonService} from '../shared/services/common.service';
import {MapThumbnailItem} from '../shared/interfaces/map-thumbnail-item';
import {v4 as uuid} from 'uuid';

@Component({
  selector: 'ts-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userSpacesList: MapThumbnailItem[];
  constructor(private _common: CommonService) {
    const tempUuid = uuid();
    localStorage.setItem('tmp_user_id', tempUuid);
  }

  ngOnInit() {
    this.userSpacesList = [
      {
        title: 'Park',
        iconUrl: 'assets/images/user-spaces/park.png',
        _id: '1',
        roomTitle: 'park',
        tag: 'Family',
        caption: 'Upto 100 users',
      },
      {
        title: 'Concert',
        iconUrl: 'assets/images/user-spaces/concert.png',
        _id: '2',
        roomTitle: 'concert',
        tag: 'Friends',
        caption: 'Upto 100 users',
      },
      {
        title: 'Park',
        iconUrl: 'assets/images/user-spaces/park.png',
        _id: '3',
        roomTitle: 'park',
        tag: 'Sports bar',
        caption: 'Upto 100 users',
      },
      {
        title: 'Family Session',
        iconUrl: 'assets/images/user-spaces/park.png',
        _id: '4',
        roomTitle: 'park',
        tag: 'Family',
        caption: 'Upto 100 users',
      }
    ];
  }
}
