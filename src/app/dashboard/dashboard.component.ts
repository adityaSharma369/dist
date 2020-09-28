import {Component, OnInit} from '@angular/core';
import {CommonService} from '../shared/services/common.service';

export interface UserSpace {
  title: string;
  iconUrl: string;
  roomId: string;
  roomTitle: string;
  tag: string;
  caption: string;
}

@Component({
  selector: 'ts-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  userSpacesList: UserSpace[];
  constructor(private _common: CommonService) {
    // this._common._router.navigate(['room', '5f6a08172d5b0a00131fafd5', 'zappy_test']);
  }

  ngOnInit() {
    this.userSpacesList = [
      {
        title: 'Park',
        iconUrl: 'assets/images/user-spaces/park.png',
        roomId: '1',
        roomTitle: 'park',
        tag: 'Family',
        caption: 'Upto 100 users',
      },
      {
        title: 'Concert',
        iconUrl: 'assets/images/user-spaces/concert.png',
        roomId: '2',
        roomTitle: 'concert',
        tag: 'Friends',
        caption: 'Upto 100 users',
      },
      {
        title: 'Park',
        iconUrl: 'assets/images/user-spaces/park.png',
        roomId: '3',
        roomTitle: 'park',
        tag: 'Sports bar',
        caption: 'Upto 100 users',
      },
      {
        title: 'Family Session',
        iconUrl: 'assets/images/user-spaces/park.png',
        roomId: '4',
        roomTitle: 'park',
        tag: 'Family',
        caption: 'Upto 100 users',
      }
    ];
  }
}
