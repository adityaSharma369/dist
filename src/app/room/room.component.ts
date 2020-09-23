import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import {CommonService} from '../shared/services/common.service';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {SocketService} from '../shared/services/socket.service';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../shared/services/api.service';

export interface Location {
  x: number;
  y: number;
}

export interface LastState {
  location: Location;
  user_character: string;
  face_towards: string;
}

export interface Attendee {
  room_id: string;
  is_host: boolean;
  tmp_user_id: string;
  last_state: LastState;
  preferences: any[];
}

export interface RoomLoginDetails {
  room: string;
  attendee: Attendee;
  room_access_token: string;
  twilio_token: string;
}

@Component({
  selector: 'ts-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RoomComponent implements OnInit, AfterViewInit, OnDestroy {


  roomId: string;
  roomTitle: string;
  roomLoginDetails: RoomLoginDetails;

  isComponentDestroying: Subject<any> = new Subject<any>();

  polygon: any[] = [];
  assetCoords: any[] = [];
  access_token: any;
  character_animation_time = 100;
  amplify_step_count = 2;

  asset_scale = 2;
  character_animation_base = 'assets/images/map_assets/character/';

  my_state;
  characters = {};

  window_width = 0;
  window_height = 0;

  map_width = 5600;
  map_height = 5600;

  @ViewChild('localVideo', {static: true}) localVideo: ElementRef;
  @ViewChild('remoteVideos', {static: true}) remoteVideos: ElementRef;

  // cornersX:any[] = []
  // cornersY:any[] = []
  constructor(private apiService: ApiService,
              private common: CommonService,
              private route: ActivatedRoute,
              private socketService: SocketService) {

    this.route.params.subscribe((params) => {
      const {roomId, roomTitle} = params;
      if (roomId) {
        this.roomId = roomId;
      } else {
        this.common._alert.showAlert('Room ID not found', 'info');
      }

      if (roomTitle) {
        this.roomTitle = roomTitle;
      } else {
        this.common._alert.showAlert('Room title not found', 'info');
      }

      this.getRoomLoginDetails();

    });

    this.socketService.on('newAttendee', (data: Attendee) => {
      this.addNewAttendee(data);
    });
  }

  ngOnInit() {

    this.render_assets();

    fromEvent(document.body, 'keydown').pipe(takeUntil(this.isComponentDestroying)).subscribe(this.keydown_handler.bind(this));
    fromEvent(document.body, 'keyup').pipe(takeUntil(this.isComponentDestroying)).subscribe(this.keyup_handler.bind(this));
    fromEvent(window, 'resize').pipe(takeUntil(this.isComponentDestroying)).subscribe(this.resize_handler.bind(this));
    fromEvent(window, 'load').pipe(takeUntil(this.isComponentDestroying)).subscribe(this.resize_handler.bind(this));
    fromEvent(window, 'scroll').pipe(debounceTime(250), takeUntil(this.isComponentDestroying)).subscribe(this.scroll_handler.bind(this));

    // $(document).on('keydown', this.keydown_handler);
    // this.twilioToken();

  }

  ngAfterViewInit() {
    this.common.twilio.localVideo = this.localVideo;
    this.common.twilio.r.push(this.remoteVideos);

  }

  ngOnDestroy() {
    this.isComponentDestroying.next();
  }

  getRoomLoginDetails(): void {
    const payload = {
      room_id: this.roomId
    };
    this.apiService.post(this.apiService.apiUrl + '/roomLogin', payload).subscribe((response) => {
      this.roomLoginDetails = response.data;
      this.initiateSocketHandshake();
      this.addMe(this.roomLoginDetails.attendee);
    }, (error) => {
      this.common._alert.showAlert(error.error || error.err, 'error');
    });
  }

  initiateSocketHandshake() {
    const payload = {...this.roomLoginDetails.attendee};
    this.socketService.send('handshake', payload);
  }

  addMe(attendee: Attendee) {
    this.my_state = {
      id: attendee.tmp_user_id,
      character_width: 60,
      character_height: 98,
      location: attendee.last_state.location,
      character: attendee.last_state.user_character,
      face_towards: attendee.last_state.face_towards,
      my_map_scope_box: {
        top_left: {x: 0, y: 0},
        top_right: {x: 0, y: 0},
        bottom_left: {x: 0, y: 0},
        bottom_right: {x: 0, y: 0}
      },
      step_count: 20
    };

    this.spawn_character(this.my_state, () => {
      this.resetMapScope(this.my_state.location);
    });
  }

  addNewAttendee(attendee: Attendee) {
    const character = {
      id: attendee.tmp_user_id,
      character_width: 60,
      character_height: 98,
      location: attendee.last_state.location,
      character: attendee.last_state.user_character,
      face_towards: attendee.last_state.face_towards,
      step_count: 30
    };

    this.characters[character.id] = character;
    this.spawn_character(character, null);

    console.log(this.characters);
  }


  isInBox(p, box_edges) {
    // console.log(p, box_edges.top_left, box_edges.bottom_right, "is in box")
    return box_edges.top_left.x <= p.x && p.x <= box_edges.bottom_right.x && box_edges.top_left.y <= p.y && p.y <= box_edges.bottom_right.y;

  }

  isPointInPolygon(left, top) {

    const x = left;
    const y = top;

    for (let index = 0; index < this.polygon.length; index++) {
      const element = this.polygon[index].restricted_polygon;
      let inside = false;
      for (let i = 0, j = element.length - 1; i < element.length; j = i++) {
        const xi = (element[i][0]);
        const yi = (element[i][1]);
        const xj = (element[j][0]);
        const yj = (element[j][1]);

        const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
          inside = !inside;
        }
      }
      if (inside) {
        console.log(left, top, this.polygon[index], 'element is blocking');
        return inside;
      }
    }
    return false;
  }

  render_assets() {
    this.apiService.get('assets/location8.json').subscribe((data: any) => {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];

        if (element.image.indexOf('Fire') > -1) {
          element.width = 50;
          element.height = 56.5;
          element.top -= 25;
          // element.left -= 10;
        }

        element.width *= this.asset_scale;
        element.height *= this.asset_scale;
        element.left *= this.asset_scale;
        element.top *= this.asset_scale;

        // let p = element['restricted_polygon']
        if (element.restricted_polygon.length > 0) {
          let new_items = [];
          element.restricted_polygon.forEach((item) => {
            let new_item = [];
            new_item[0] = item[0] * this.asset_scale;
            new_item[1] = item[1] * this.asset_scale;
            new_items.push(new_item);
          });

          element.restricted_polygon = new_items;

          this.polygon.push(element);
        }
        // delete element['restricted_polygon']
        this.assetCoords.push(element);

      }
    });
  }

  keydown_handler(e) {
    // e.preventDefault();

    const key_code = e.which || e.keyCode;
    const possible_conflicts = [];
    let is_within_map_boundary = false;

    let proposed_position: any = {};
    const handle_keys = [37, 38, 39, 40];

    if (handle_keys.indexOf(key_code) > -1) {
      e.preventDefault();
    }

    let current_face_towards = 'right';

    console.log(key_code, 'this is key_code');

    switch (key_code) {
      case 37: // left
        proposed_position = {
          x: this.my_state.location.x - this.my_state.step_count * this.amplify_step_count,
          y: this.my_state.location.y
        };

        possible_conflicts.push({
          x: this.my_state.location.x - this.my_state.step_count,
          y: this.my_state.location.y
        });

        possible_conflicts.push({
          x: this.my_state.location.x - this.my_state.step_count,
          y: this.my_state.location.y + this.my_state.character_height
        });

        is_within_map_boundary = this.my_state.location.x - this.my_state.step_count > 0;
        current_face_towards = 'left';


        break;
      case 38: // up

        current_face_towards = 'up';

        proposed_position = {
          x: this.my_state.location.x,
          y: this.my_state.location.y - this.my_state.step_count * this.amplify_step_count
        };

        possible_conflicts.push({
          x: this.my_state.location.x,
          y: this.my_state.location.y - this.my_state.step_count
        });

        possible_conflicts.push({
          x: this.my_state.location.x + this.my_state.character_width,
          y: this.my_state.location.y - this.my_state.step_count
        });

        is_within_map_boundary = this.my_state.location.y - this.my_state.step_count > 0;


        break;
      case 39: // right

        proposed_position = {
          x: this.my_state.location.x + this.my_state.step_count * this.amplify_step_count,
          y: this.my_state.location.y
        };

        possible_conflicts.push({
          x: this.my_state.location.x + this.my_state.character_width + this.my_state.step_count,
          y: this.my_state.location.y
        });

        possible_conflicts.push({
          x: this.my_state.location.x + this.my_state.character_width + this.my_state.step_count,
          y: this.my_state.location.y + this.my_state.character_height
        });

        is_within_map_boundary = this.my_state.location.x + this.my_state.character_width + this.my_state.step_count < this.map_width;

        current_face_towards = 'right';

        break;
      case 40: // down

        proposed_position = {
          x: this.my_state.location.x,
          y: this.my_state.location.y + this.my_state.step_count * this.amplify_step_count
        };

        possible_conflicts.push({
          x: this.my_state.location.x,
          y: this.my_state.location.y + this.my_state.character_height + this.my_state.step_count
        });

        possible_conflicts.push({
          x: this.my_state.location.x + this.my_state.character_width,
          y: this.my_state.location.y + this.my_state.character_height + this.my_state.step_count
        });

        is_within_map_boundary = this.my_state.location.y + this.my_state.character_height + this.my_state.step_count < this.map_height;

        current_face_towards = 'down';

        break;

      case 77:
        const tmp_location = this.characters['character1'].location;
        tmp_location.x += 50;
        this.update_character_position('character1', tmp_location, 100);
        break;
      default:
        return; // exit this handler for other keys
    }

    if (current_face_towards !== this.my_state.face_towards) {
      $('#my_character img').attr('src', this.character_animation_base + this.my_state.character + '/' + current_face_towards + '.gif');
    }

    this.my_state.face_towards = current_face_towards;

    if (is_within_map_boundary) {

      let is_proposed_position_valid = true;

      possible_conflicts.forEach((position) => {
        if (!is_proposed_position_valid) {
          return;
        }

        if (this.isPointInPolygon(position.x, position.y)) {
          is_proposed_position_valid = false;
          return;
        }
        Object.keys(this.characters).forEach((character_id) => {
          const character = this.characters[character_id];
          const char_box = {
            top_left: character.location,
            bottom_right: {
              x: character.location.x + character.character_width,
              y: character.location.y + character.character_height
            },
          };
          if (this.isInBox(position, char_box)) {
            is_proposed_position_valid = false;
            return;
          }
        });
      });

      if (is_proposed_position_valid) {
        $('#my_character').dequeue().animate({
          left: proposed_position.x + 'px',
          top: proposed_position.y + 'px'
        }, this.character_animation_time);

        this.my_state.location = proposed_position;
        this.resetMapScope(this.my_state.location);

      }
    }
  }

  keyup_handler(e) {
    const key_code = e.which || e.keyCode;

    switch (key_code) {
      case 37:
      case 38:
      case 39:
      case 40:
        // tslint:disable-next-line:max-line-length
        $('#my_character img').attr('src', this.character_animation_base + this.my_state.character + '/' + this.my_state.face_towards + '_static.gif');
        break;
    }
  }

  resetMapScope(location) {

    // console.log(this.isInBox(this.my_state.location, this.my_state.my_map_scope_box), "isinbox")

    if (!this.isInBox(this.my_state.location, this.my_state.my_map_scope_box)) {

      const final_scroll = {};

      const scroll_left = $(document).scrollLeft();
      const scroll_top = $(document).scrollTop();

      const center_y = scroll_top + (this.window_height / 2);
      const center_x = scroll_left + (this.window_width / 2);

      const diff_x = this.my_state.location.x - center_x;
      const diff_y = this.my_state.location.y - center_y;

      final_scroll['scrollLeft'] = (scroll_left + diff_x) + 'px';
      final_scroll['scrollTop'] = (scroll_top + diff_y) + 'px';

      // console.log("need to scroll", diff_x, diff_y, final_scroll);

      $('html, body').dequeue().animate(final_scroll, this.character_animation_time);
    }

    // if (this.my_state.location.y > 0.8 * current_map_scope_top) {
    //   console.log("scroll bottom")
    // }
    // console.log("window_height", this.window_height, this.window_width, this.my_state.location, current_map_scope_left, current_map_scope_top)
  }

  reset_scope_box() {
    // if my location then generate my_state.my_map_scope_box
    const scroll_left = $(document).scrollLeft();
    const scroll_top = $(document).scrollTop();

    const center_y = scroll_top + (this.window_height / 2);
    const center_x = scroll_left + (this.window_width / 2);

    const box_width = 0 * this.window_width;
    const box_height = 0 * this.window_height;

    this.my_state.my_map_scope_box = {
      top_left: {x: center_x - box_width, y: center_y - box_height},
      top_right: {x: center_x + box_width, y: center_y - box_height},
      bottom_left: {x: center_x - box_width, y: center_y + box_height},
      bottom_right: {x: center_x + box_width, y: center_y + box_height},
    };
  }

  resize_handler(e) {
    this.window_height = e.currentTarget.innerHeight;
    this.window_width = e.currentTarget.innerWidth;
    this.reset_scope_box();
  }

  scroll_handler(e) {
    this.reset_scope_box();
  }


  spawn_character(character, cb) {
    const jquery_character_wrapper = $('.character-wrapper');
    // tslint:disable-next-line:max-line-length
    jquery_character_wrapper.append('<div style="top:' + character.location.y + 'px;left:' + character.location.x + 'px" id="' + character.id + '" class="character"> <img src="' + this.character_animation_base + character.character + '/' + character.face_towards + '.gif' + '"  > </div>');
    if (cb) {
      cb();
    }
  }

  update_character_position(char_id, location, animate = this.character_animation_time
  ) {
    this.characters[char_id].location = location;
    $('.character#' + char_id).dequeue().animate({
      left: location.x + 'px',
      top: location.y + 'px'
    }, animate);
  }

  twilioToken() {
    console.log('hello');
    const storage = JSON.parse(localStorage.getItem('token') || '{}');
    const date = Date.now();
    console.log('at down');
    // if (storage['token'] && storage['created_at'] + 3600000 > date) {
    //   console.log('in token')
    //   this.access_token = storage['token'];
    //   this.common.twilio.connectToRoom(this.access_token,
    //     { name: 'test',
    //       audio: true,
    //       video: { width: 240 }
    //     })
    //   return;
    // }

    this.common._api.get(this.common._api.apiUrl + '/generateToken').subscribe((resp: any) => {
        console.log(resp, 'in the api part');
        this.access_token = resp.data['token'];
        console.log(this.access_token, 'access_token');
        // this.username = d['username'];
        localStorage.setItem('token', JSON.stringify({
          token: this.access_token,
          // username:this.username,
          created_at: date
        }));

        this.common.twilio.connectToRoom(this.access_token,
          {
            name: 'test',
            audio: true,
            video: {width: 320}
          });
      },
      error => console.log(JSON.stringify(error)));

  }


}
