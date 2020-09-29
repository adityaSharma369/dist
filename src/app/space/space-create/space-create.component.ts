import {Component, OnInit} from '@angular/core';
import {CommonService} from './../../shared/services/common.service';
import {MapThumbnailItem} from '../../shared/interfaces/map-thumbnail-item';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'ts-space-create',
  templateUrl: './space-create.component.html',
  styleUrls: ['./space-create.component.scss']
})
export class SpaceCreateComponent implements OnInit {

  spaceForm: FormGroup;
  mapsList: MapThumbnailItem[];

  constructor(private _common: CommonService) {
  }

  ngOnInit() {
    this.mapsList = [
      {
        title: 'Park',
        iconUrl: 'assets/images/user-spaces/park.png',
        tag: 'Family',
        caption: 'Upto 100 users',
        _id: '1'
      },
      {
        title: 'Concert',
        iconUrl: 'assets/images/user-spaces/concert.png',
        tag: 'Friends',
        caption: 'Upto 100 users',
        _id: '2'
      },
      {
        title: 'Park',
        iconUrl: 'assets/images/user-spaces/park.png',
        tag: 'Sports bar',
        caption: 'Upto 100 users',
        _id: '3'
      }
    ];

    this.initForm();
    this.getMapsList();
  }

  getMapsList() {
    this._common._api.get(this._common._api.apiUrl + '/mapsList').subscribe((response) => {

    }, (error) => {

    });
  }

  initForm() {
    this.spaceForm = this._common._fb.group({
      space_name: [],
      privacy_type: ['public'],
      is_guest_accessible: [true],
      streaming_url: [],
      space_password: [],
      map_id: []
    });
  }

  get f() {
    return this.spaceForm.controls;
  }

  createSpace() {
    console.log(this.spaceForm.value);
  }

  selectMap(map: MapThumbnailItem) {
    this.spaceForm.patchValue({
      map_id: map._id
    });
  }
}
