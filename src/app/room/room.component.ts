import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import {CommonService} from '../shared/services/common.service';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';
import {SocketService} from '../shared/services/socket.service';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../shared/services/api.service';
import {AuthService} from '../shared/services/auth.service';
import {fadeInAndOut} from '../shared/animations/triggers';
import {TwilioService} from '../shared/services/twilio.service';

export interface SettingsMenuItem {
  icon: string;
  hoverIcon?: string;
  toolTipText: string;
  key: string;
}

export interface Location {
  x: number;
  y: number;
}

export interface LastState {
  location: Location;
  is_walking: boolean;
  user_character: string;
  face_towards: string;
}

export interface Attendee {
  room_id: string;
  is_host: boolean;
  tmp_user_id: string;
  name?: string;
  last_state: LastState;
  preferences: any[];
  streams?: any[];
}

export interface RoomLoginDetails {
  room: string;
  attendee: Attendee;
  room_access_token: string;
  twilio_token: string;
}

const ASSET_GIVEN_SCALE = 2;
const RESIZE_SCALE = 0.65;

@Component({
  selector: 'ts-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fadeInAndOut
  ]
})

export class RoomComponent implements OnInit, AfterViewInit, OnDestroy {

  roomId: string;
  roomTitle: string;
  roomLoginDetails: RoomLoginDetails;
  isComponentDestroying: Subject<any> = new Subject<any>();

  last_pushed_socket_state: any = {};


  polygon: any[] = [];
  assetCoords: any[] = [];
  access_token: any;

  cached_rooms = [];

  mapConfig = {
    scale: RESIZE_SCALE,
    asset_scale: ASSET_GIVEN_SCALE * RESIZE_SCALE,
    my_map_scope_box: {
      top_left: {x: 0, y: 0},
      top_right: {x: 0, y: 0},
      bottom_left: {x: 0, y: 0},
      bottom_right: {x: 0, y: 0}
    },
  };

  characterConfig = {
    character_animation_base: 'assets/images/map_assets/character/',
    character_width: 60 * this.mapConfig.scale,
    character_height: 111 * this.mapConfig.scale,
    character_animation_time: 100,
    step_count: 15,
    amplify_step_count: 1
  };

  disco_points = [{x: 2028 * this.mapConfig.scale, y: 1093 * this.mapConfig.scale}];

  my_attendee: Attendee;
  attendees = {};

  window_width = 0;
  window_height = 0;

  map_width = 5600 * this.mapConfig.scale;
  map_height = 5600 * this.mapConfig.scale;

  proximity_attendees = [];

  @ViewChild('localVideo', {static: true}) localVideo: ElementRef;
  @ViewChild('remoteVideos', {static: true}) remoteVideos: ElementRef;

  isRoomSettingsOpen: boolean;
  roomSettingsMenuList: SettingsMenuItem[] = [
    {
      key: 'avatar',
      icon: 'avatar',
      toolTipText: 'change avatar'
    },
    {
      key: 'status',
      icon: 'status-online',
      toolTipText: 'update status'
    },
    {
      key: 'proximity',
      icon: 'proximity',
      toolTipText: 'interaction distance'
    },
    {
      key: 'screen',
      icon: 'share-screen',
      toolTipText: 'share screen'
    },
    {
      key: 'video',
      icon: 'video-off',
      toolTipText: 'camera'
    },
    {
      key: 'mic',
      icon: 'mic-on',
      toolTipText: 'mic'
    },
    {
      key: 'locate',
      icon: 'map',
      toolTipText: 'Locate me'
    },
    {
      key: 'logout',
      icon: 'logout',
      toolTipText: 'Logout'
    }
  ];

  roomSettingsConfig = {
    proximityLevel: 3,
    micState: null,
    webCamState: null,
    screenState: null,
    avatarConfig: null
  };

  // cornersX:any[] = []
  // cornersY:any[] = []
  constructor(private apiService: ApiService,
              private common: CommonService,
              private auth: AuthService,
              private twilio: TwilioService,
              private route: ActivatedRoute,
              private socketService: SocketService) {

    if (localStorage.getItem('cached_rooms')) {
      this.cached_rooms = JSON.parse(localStorage.getItem('cached_rooms'));
    }


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
      // this.getRoomAttendees();
    });

  }

  window_load_handler(e) {
    this.resize_handler(e);

    this.socketService.connectionEvent('disconnect').subscribe(() => {
      this.socketService.connect();
    });

    this.socketService.connectionEvent('connect').subscribe(() => {
      if (this.roomLoginDetails) {
        this.initiateSocketHandshake();
        this.getRoomAttendees();
      }
    });

    this.socketService.on('newAttendee', this.addNewAttendee.bind(this));

    this.socketService.on('deleteAttendee', this.deleteAttendee.bind(this));

    this.socketService.on('characterChange', this.characterChange.bind(this));
  }

  ngOnInit() {

    this.render_assets();

    fromEvent(document.body, 'keydown').pipe(takeUntil(this.isComponentDestroying)).subscribe(this.keydown_handler.bind(this));
    fromEvent(window, 'resize').pipe(takeUntil(this.isComponentDestroying)).subscribe(this.resize_handler.bind(this));
    fromEvent(window, 'load').pipe(takeUntil(this.isComponentDestroying)).subscribe(this.window_load_handler.bind(this));
    fromEvent(window, 'scroll').pipe(debounceTime(250), takeUntil(this.isComponentDestroying)).subscribe(this.scroll_handler.bind(this));

    fromEvent(window, 'onmousewheel').pipe(debounceTime(250), takeUntil(this.isComponentDestroying)).subscribe(this.disable_event.bind(this));
    // $(document).on('keydown', this.keydown_handler);
    // this.twilioToken();
  }


  ngAfterViewInit() {
    this.twilio.localVideo = this.localVideo;
    this.twilio.r.push(this.remoteVideos);
  }

  ngOnDestroy() {
    this.isComponentDestroying.next();
  }

  getRoomAttendees(): void {
    this.apiService.get(this.apiService.apiUrl + '/getRoomAttendees/' + this.roomId, {}, {'Authorization': 'Bearer ' + this.roomLoginDetails.room_access_token}).subscribe((response) => {
      response.data.forEach((item: Attendee) => {
        this.addNewAttendee(item);
      });
    }, (error) => {
      this.common._alert.showAlert(error.error || error.err, 'error');
    });
  }

  getRoomLoginDetails(): void {

    const payload = {
      room_id: this.roomId
    };
    console.log(this.cached_rooms);

    if (this.cached_rooms.length > 0) {
      // resume login
      const room_access_token = this.cached_rooms[this.cached_rooms.length - 1]['room_access_token'];
      this.apiService.get(this.apiService.apiUrl + '/resumeLogin', {}, {'Authorization': 'Bearer ' + room_access_token}).subscribe((response) => {
        this.roomLoginDetails = response.data;
        this.roomLoginDetails.room_access_token = room_access_token;
        this.initiateSocketHandshake();
        this.addMe(this.roomLoginDetails.attendee);

        this.getRoomAttendees();
        this.twilioConnect();
      }, (error) => {
        this.common._alert.showAlert(error.error || error.err, 'error');
      });
    } else {
      // new login
      this.apiService.post(this.apiService.apiUrl + '/roomLogin', payload).subscribe((response) => {
        this.roomLoginDetails = response.data;
        this.roomLoginDetails.attendee.last_state.face_towards = 'right';
        // this.roomLoginDetails.attendee.last_state.location.x *= this.mapConfig.scale;
        // this.roomLoginDetails.attendee.last_state.location.y *= this.mapConfig.scale;
        console.log(response.data);
        this.cached_rooms.push({
          'name': this.roomLoginDetails.room,
          'room_access_token': this.roomLoginDetails.room_access_token
        });
        localStorage.setItem('cached_rooms', JSON.stringify(this.cached_rooms));
        this.initiateSocketHandshake();
        this.addMe(this.roomLoginDetails.attendee);
        this.getRoomAttendees();
        this.twilioConnect();


      }, (error) => {
        this.common._alert.showAlert(error.error || error.err, 'error');
      });
    }

  }

  initiateSocketHandshake() {
    if (this.roomLoginDetails) {
      const payload = {...this.roomLoginDetails.attendee};
      this.socketService.send('handshake', payload);
    }
  }

  pushChangesToSocket() {
    if (!this.last_pushed_socket_state.location || (this.last_pushed_socket_state.location.x != this.my_attendee.last_state.location.x || this.last_pushed_socket_state.location.y != this.my_attendee.last_state.location.y)) {
      this.socketService.send('characterChange', {
        tmp_user_id: this.my_attendee.tmp_user_id,
        last_state: this.my_attendee.last_state
      });

      this.last_pushed_socket_state = {...this.my_attendee.last_state};
    }
  }

  giveAvailableLocationForSpawn() {
    return {x: 1500, y: 400};
  }


  addMe(attendee: Attendee) {
    this.my_attendee = attendee;
    this.my_attendee.last_state.is_walking = false;
    if (this.my_attendee.last_state.location.x == null) {
      this.my_attendee.last_state.location = this.giveAvailableLocationForSpawn();
    }
    this.spawn_attendee(this.my_attendee, () => {
      setInterval(() => {
        this.pushChangesToSocket();
      }, 300);
    });
  }

  addNewAttendee(attendee: Attendee) {
    attendee.last_state.is_walking = false;

    if (!this.attendees[attendee.tmp_user_id]) {
      this.spawn_attendee(attendee, null);
    }

    this.attendees[attendee.tmp_user_id] = attendee;
  }

  deleteAttendee(data) {
    delete this.attendees[data.tmp_user_id];
    const jquery_character_wrapper = $('.character-wrapper #' + data.tmp_user_id);
    // tslint:disable-next-line:max-line-length
    jquery_character_wrapper.remove();
  }

  characterChange(data) {
    let attendee = this.attendees[data.tmp_user_id];
    if (attendee) {
      // attendee.last_state = data.last_state;
      this.update_character_position(data.tmp_user_id, data.last_state);
      this.checkUserProximity(data.last_state.location, data.tmp_user_id);
      this.renderProximityVideos();
    }
    console.log(data, 'characterChange');
  }

  isInBox(p, box_edges) {
    return box_edges.top_left.x <= p.x && p.x <= box_edges.bottom_right.x && box_edges.top_left.y <= p.y && p.y <= box_edges.bottom_right.y;
  }

  isPointInPolygon(left, top) {
    const x = left;
    const y = top;

    for (let index = 0; index < this.polygon.length; index++) {
        const element = this.polygon[index]
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

    // const x = left;
    // const y = top;

    // for (let index = 0; index < this.polygon.length; index++) {
    //   const element = this.polygon[index].restricted_polygon;
    //   let inside = false;
    //   for (let i = 0, j = element.length - 1; i < element.length; j = i++) {
    //     const xi = (element[i][0]);
    //     const yi = (element[i][1]);
    //     const xj = (element[j][0]);
    //     const yj = (element[j][1]);

    //     const intersect = ((yi > y) !== (yj > y))
    //       && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    //     if (intersect) {
    //       inside = !inside;
    //     }
    //   }
    //   if (inside) {
    //     console.log(left, top, this.polygon[index], 'element is blocking');
    //     return inside;
    //   }
    // }
    // return false;
  }

  pointDistance(loc1, loc2) {
    var a = loc1.x - loc2.x;
    var b = loc1.y - loc2.y;
    var c = Math.sqrt(a * a + b * b);
    return c;
  }

  render_assets() {
    this.apiService.get('assets/location15.json').subscribe((data: any) => {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];

        // if (element.image.indexOf('Fire') > -1) {
        //     element.width = 50*this.mapConfig.scale;
        //     element.height = 56.5*this.mapConfig.scale;
        //     element.top -= 25*this.mapConfig.scale;
        //     // element.left -= 10;
        // }

        element.width *= this.mapConfig.asset_scale;
        element.height *= this.mapConfig.asset_scale;
        element.left *= this.mapConfig.asset_scale;
        element.top *= this.mapConfig.asset_scale;

        let p = element['restricted_polygon']
        console.log(p.length,'polygon length')
        for (let index = 0; index < element.restricted_polygon.length; index++) {
            const poly = element.restricted_polygon[index];
            if (poly.length > 0) {
                let new_items = [];
                poly.forEach((item) => {
                    let new_item = [];
                    new_item[0] = item[0] * this.mapConfig.asset_scale;
                    new_item[1] = item[1] * this.mapConfig.asset_scale;
                    new_items.push(new_item);
                });
                // element.restricted_polygon = new_items;
                this.polygon.push(new_items);
            }   
        }   
        // delete element['restricted_polygon']
        this.assetCoords.push(element);

    }

    });
  }

  walking_state_timeout = {};

  keydown_handler(e) {

    const key_code = e.which || e.keyCode;
    const possible_conflicts = [];
    let is_within_map_boundary = false;

    let proposed_position: any = {};
    const handle_keys = [37, 38, 39, 40];

    if (handle_keys.indexOf(key_code) > -1) {
      e.preventDefault();
    }

    this.resetMapScope();


    let current_face_towards = 'right';

    switch (key_code) {
      case 37: // left
        proposed_position = {
          x: this.my_attendee.last_state.location.x - this.characterConfig.step_count * this.characterConfig.amplify_step_count,
          y: this.my_attendee.last_state.location.y
        };

        possible_conflicts.push({
          x: this.my_attendee.last_state.location.x - this.characterConfig.step_count,
          y: this.my_attendee.last_state.location.y
        });

        possible_conflicts.push({
          x: this.my_attendee.last_state.location.x - this.characterConfig.step_count,
          y: this.my_attendee.last_state.location.y + this.characterConfig.character_height
        });

        is_within_map_boundary = this.my_attendee.last_state.location.x - this.characterConfig.step_count > 0;
        current_face_towards = 'left';


        break;
      case 38: // up

        current_face_towards = 'up';

        proposed_position = {
          x: this.my_attendee.last_state.location.x,
          y: this.my_attendee.last_state.location.y - this.characterConfig.step_count * this.characterConfig.amplify_step_count
        };

        possible_conflicts.push({
          x: this.my_attendee.last_state.location.x,
          y: this.my_attendee.last_state.location.y - this.characterConfig.step_count
        });

        possible_conflicts.push({
          x: this.my_attendee.last_state.location.x + this.characterConfig.character_width,
          y: this.my_attendee.last_state.location.y - this.characterConfig.step_count
        });

        is_within_map_boundary = this.my_attendee.last_state.location.y - this.characterConfig.step_count > 0;


        break;
      case 39: // right

        proposed_position = {
          x: this.my_attendee.last_state.location.x + this.characterConfig.step_count * this.characterConfig.amplify_step_count,
          y: this.my_attendee.last_state.location.y
        };

        possible_conflicts.push({
          x: this.my_attendee.last_state.location.x + this.characterConfig.character_width + this.characterConfig.step_count,
          y: this.my_attendee.last_state.location.y
        });

        possible_conflicts.push({
          x: this.my_attendee.last_state.location.x + this.characterConfig.character_width + this.characterConfig.step_count,
          y: this.my_attendee.last_state.location.y + this.characterConfig.character_height
        });

        is_within_map_boundary = this.my_attendee.last_state.location.x + this.characterConfig.character_width + this.characterConfig.step_count < this.map_width;

        current_face_towards = 'right';

        break;
      case 40: // down

        proposed_position = {
          x: this.my_attendee.last_state.location.x,
          y: this.my_attendee.last_state.location.y + this.characterConfig.step_count * this.characterConfig.amplify_step_count
        };

        possible_conflicts.push({
          x: this.my_attendee.last_state.location.x,
          y: this.my_attendee.last_state.location.y + this.characterConfig.character_height + this.characterConfig.step_count
        });

        possible_conflicts.push({
          x: this.my_attendee.last_state.location.x + this.characterConfig.character_width,
          y: this.my_attendee.last_state.location.y + this.characterConfig.character_height + this.characterConfig.step_count
        });

        is_within_map_boundary = this.my_attendee.last_state.location.y + this.characterConfig.character_height + this.characterConfig.step_count < this.map_height;

        console.log('down is_boundary', this.my_attendee.last_state.location.y, this.characterConfig.character_height, this.characterConfig.step_count, this.map_height);
        current_face_towards = 'down';

        break;

      default:
        return; // exit this handler for other keys
    }

    // this.my_attendee.last_state.face_towards = current_face_towards;

    if (is_within_map_boundary) {

      let is_proposed_position_valid = true;
      this.proximity_attendees = [];

      possible_conflicts.forEach((position) => {
        if (!is_proposed_position_valid) {
          return;
        }

        if (this.isPointInPolygon(position.x, position.y)) {
          is_proposed_position_valid = false;
          return;
        }

        Object.keys(this.attendees).forEach((character_id) => {
          const attendee = this.attendees[character_id];
          const char_box = {
            top_left: attendee.last_state.location,
            bottom_right: {
              x: attendee.last_state.location.x + this.characterConfig.character_width,
              y: attendee.last_state.location.y + this.characterConfig.character_height
            },
          };

          this.checkUserProximity(char_box.top_left, character_id);

          if (this.isInBox(position, char_box)) {
            is_proposed_position_valid = false;
          }

        });
      });

      this.renderProximityVideos();


      if (is_proposed_position_valid) {

        let new_state = this.my_attendee.last_state;
        new_state.location = proposed_position;
        new_state.face_towards = current_face_towards;

        this.update_character_position(this.my_attendee.tmp_user_id, new_state);


        this.resetDiscoVolume();

      }
    } else {
      console.log('map ourside boundary');
    }
  }

  checkUserProximity(location, character_id) {
    const position = this.my_attendee.last_state.location;
    let char_centroid: any = {};
    char_centroid.x = location.x + this.characterConfig.character_width / 2;
    char_centroid.y = location.y + this.characterConfig.character_height / 2;

    // console.log("this.pointDistance(position, char_centroid)", this.pointDistance(position, char_centroid), this.characterConfig.character_height, this.my_attendee);

    const proximity_attendee_index = this.proximity_attendees.indexOf(character_id);
    let prox_value = this.pointDistance(position, char_centroid);

    console.log(prox_value, 'prox_value');

    if (prox_value < this.characterConfig.character_height + this.roomSettingsConfig.proximityLevel * 5) {
      console.log('added to proximity');

      const audioElem = $('#remote-video-' + character_id + ' audio').get(0);
      let volume = 0;

      // TODO revamp the logic
      const max_val = this.roomSettingsConfig.proximityLevel * 100 + this.characterConfig.character_height;
      const percentage_far = 1 - prox_value / max_val;

      if (audioElem) {
        if (percentage_far >= 0) {
          audioElem.volume = percentage_far;
        }
      }

      console.log('VOLUME @#$@#$@#$@#$@#$ ', percentage_far, character_id);


      if (proximity_attendee_index === -1) {
        this.proximity_attendees.push(character_id);
      }
    } else {
      if (proximity_attendee_index > -1) {
        this.proximity_attendees.splice(proximity_attendee_index, 1);
      }
    }
  }

  renderProximityVideos() {
    this.twilio.connectToUsers(this.proximity_attendees);
  }

  resetMapScope(force = false) {

    // console.log(this.isInBox(this.my_attendee.last_state.location, this.mapConfig.my_map_scope_box), "isinbox")

    if (!this.isInBox(this.my_attendee.last_state.location, this.mapConfig.my_map_scope_box) || force) {

      const final_scroll = {};

      const scroll_left = $(document).scrollLeft();
      const scroll_top = $(document).scrollTop();

      const center_y = scroll_top + (this.window_height / 2);
      const center_x = scroll_left + (this.window_width / 2);

      const diff_x = this.my_attendee.last_state.location.x - center_x;
      const diff_y = this.my_attendee.last_state.location.y - center_y;

      final_scroll['scrollLeft'] = (scroll_left + diff_x) + 'px';
      final_scroll['scrollTop'] = (scroll_top + diff_y) + 'px';

      // console.log("need to scroll", diff_x, diff_y, final_scroll);

      console.log('scrolling', scroll_left, this.my_attendee.last_state.location.x, this.window_width, final_scroll);

      $('html, body').dequeue().animate(final_scroll, 400);
    }

  }

  reset_scope_box() {
    // if my location then generate mapConfig.my_map_scope_box
    const scroll_left = $(document).scrollLeft();
    const scroll_top = $(document).scrollTop();

    const center_y = scroll_top + (this.window_height / 2);
    const center_x = scroll_left + (this.window_width / 2);

    const box_width = 0.2 * this.window_width;
    const box_height = 0.2 * this.window_height;

    this.mapConfig.my_map_scope_box = {
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
    this.resetMapScope(true);
  }

  scroll_handler(e) {
    this.reset_scope_box();
  }

  disable_event(e) {
    e.preventDefault();
  }

  spawn_attendee(attendee: Attendee, cb) {
    const jquery_character_wrapper = $('.character-wrapper');
    // tslint:disable-next-line:max-line-length
    jquery_character_wrapper.append('<div style="top:' + attendee.last_state.location.y + 'px;left:' + attendee.last_state.location.x + 'px" id="' + attendee.tmp_user_id + '" class="character"> <img src="' + this.characterConfig.character_animation_base + attendee.last_state.user_character + '/' + attendee.last_state.face_towards + '.gif' + '"  > </div>');
    if (cb) {
      cb();
    }
  }

  resetDiscoVolume() {
    let volume = 0.1;
    let min_distance = 10000000;
    this.disco_points.forEach((dp) => {
      const disco_distance = this.pointDistance(this.my_attendee.last_state.location, dp);
      if (disco_distance < min_distance) {
        min_distance = disco_distance;
      }
      console.log(disco_distance, 'disco_distance');
    });

    // TODO revamp the logic
    const max_val = this.map_width / 2;
    const percentage_far = 1 - min_distance / max_val;
    this.setVolume(percentage_far);
  }

  setVolume(volume) {
    if (volume > 0) {
      $('#disco_video').get(0).volume = volume;
      console.log('disco volumne', volume);
    }
  }

  update_character_position(attendee_id, new_state, animate = this.characterConfig.character_animation_time
  ) {

    let attendee = this.attendees[attendee_id] || this.my_attendee;

    if (attendee.last_state.face_towards != new_state.face_towards || attendee.last_state.is_walking == false) {
      $('#' + attendee.tmp_user_id + ' img').attr('src', this.characterConfig.character_animation_base + new_state.user_character + '/' + new_state.face_towards + '.gif');
    }

    if (this.my_attendee.tmp_user_id == attendee_id) {
      this.my_attendee.last_state.location = new_state.location;
      this.my_attendee.last_state.is_walking = true;
    } else {
      this.attendees[attendee_id].last_state.location = new_state.location;
      this.attendees[attendee_id].last_state.is_walking = true;
    }

    $('.character#' + attendee_id).dequeue().animate({
      left: new_state.location.x + 'px',
      top: new_state.location.y + 'px'
    }, animate);

    // used to transition from walking animation to static image
    if (this.walking_state_timeout[attendee_id]) {
      clearTimeout(this.walking_state_timeout[attendee_id]);
    }

    this.walking_state_timeout[attendee_id] = setTimeout(() => {
      $('#' + attendee_id + ' img').attr('src', this.characterConfig.character_animation_base + new_state.user_character + '/' + new_state.face_towards + '_static.gif');
      if (this.my_attendee.tmp_user_id === attendee_id) {
        this.my_attendee.last_state.is_walking = false;
      } else {
        this.attendees[attendee_id].last_state.is_walking = false;
      }
    }, this.characterConfig.character_animation_time + 100);

  }

  twilioConnect() {
    console.log('twilio connect', this.roomLoginDetails);
    this.twilio.connectToRoom(this.roomLoginDetails.twilio_token,
      {
        name: this.roomId,
        audio: true,
        video: {width: 320}
      });
  }

  //
  // twilioToken() {
  //     console.log('hello');
  //     const storage = JSON.parse(localStorage.getItem('token') || '{}');
  //     const date = Date.now();
  //     console.log('at down');
  //     // if (storage['token'] && storage['created_at'] + 3600000 > date) {
  //     //   console.log('in token')
  //     //   this.access_token = storage['token'];
  //     //   this.twilio.connectToRoom(this.access_token,
  //     //     { name: 'test',
  //     //       audio: true,
  //     //       video: { width: 240 }
  //     //     })
  //     //   return;
  //     // }
  //
  //     this.common._api.get(this.common._api.apiUrl + '/generateToken').subscribe((resp: any) => {
  //             console.log(resp, 'in the api part');
  //             this.access_token = resp.data['token'];
  //             console.log(this.access_token, 'access_token');
  //             // this.username = d['username'];
  //             localStorage.setItem('token', JSON.stringify({
  //                 token: this.access_token,
  //                 // username:this.username,
  //                 created_at: date
  //             }));
  //
  //             this.twilio.connectToRoom(this.access_token,
  //                 {
  //                     name: 'test',
  //                     audio: true,
  //                     video: {width: 320}
  //                 });
  //         },
  //         error => console.log(JSON.stringify(error)));
  //
  // }


  updateSetting(settingKey: string) {
    switch (settingKey) {
      case  'avatar': {
        // logic to handle avatar update changes
        break;
      }

      case  'status': {
        // logic to handle screen share
        break;
      }

      case  'proximity': {
        const setting = this.roomSettingsMenuList.filter((item) => item.key === settingKey);
        const index = this.roomSettingsMenuList.indexOf(setting[0]);
        const proximityLevel = this.roomSettingsConfig.proximityLevel;
        if (proximityLevel === 1) {
          this.roomSettingsConfig.proximityLevel = 3;
        } else {
          this.roomSettingsConfig.proximityLevel = proximityLevel - 1;
        }
        this.roomSettingsMenuList[index].icon = 'proximity-' + this.roomSettingsConfig.proximityLevel;
        break;
      }

      case  'screen': {
        // logic to handle screen share
        break;
      }

      case  'mic': {
        // logic to handle mic
        break;
      }

      case  'webcam': {
        // logic to handle webcam
        break;
      }

      case  'location': {
        // logic to handle location
        break;
      }

      case  'logout': {
        // logic to handle mic
        break;
      }

      default:
        console.log(settingKey);
    }
  }
}
