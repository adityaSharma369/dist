import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import {HttpClient} from '@angular/common/http'
import {CommonService} from '../shared/services/common.service';
import {Observable, fromEvent, Subject,} from "rxjs";
import {takeUntil} from "rxjs/operators";


interface Location {
  x: number,
  y: number
}

// import * as data from './../../location.json';
@Component({
  selector: 'ts-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MapComponentComponent implements OnInit, AfterViewInit, OnDestroy {

  IsComponentDestroying: Subject<any> = new Subject<any>();

  polygon: any[] = [];
  asset_coord: any[] = [];
  access_token: any;
  character_animation_time = 50;

  window_width = 0;
  window_height = 0;

  characters = []

  my_location: any = {
    x: 50,
    y: 100
  };

  character_width = 60;
  character_height = 98;

  map_width = 2800;
  map_height = 2800;

  step_count = 50;


  @ViewChild("localVideo", {static: true}) localVideo: ElementRef;
  @ViewChild("remoteVideo", {static: true}) remoteVideo: ElementRef;
  @ViewChild("remoteVideo1", {static: true}) remoteVideo1: ElementRef;
  @ViewChild("remoteVideo2", {static: true}) remoteVideo2: ElementRef;
  @ViewChild("remoteVideo3", {static: true}) remoteVideo3: ElementRef;
  @ViewChild("remoteVideo4", {static: true}) remoteVideo4: ElementRef;
  @ViewChild("remoteVideo5", {static: true}) remoteVideo5: ElementRef;

  // cornersX:any[] = []
  // cornersY:any[] = []
  constructor(private httpClient: HttpClient, private common: CommonService) {
  }

  // ngAfterViewInit() {
  //   this.restrictive = this.position_restrictive_items()
  //   console.log(this.restrictive);
  // }

  // position_restrictive_items() {
  //   const restrictive = [[7, 11],[4, 69],[27, 179],[65, 279],[86, 295],[104, 300],[125, 304],[154, 304],[179, 284],[191, 262],[213, 214],[259, 112],[240, 5],[143, 4]]
  //   const top = 0
  //   const left = 839.979
  //   let new_restricitve = []
  //   for (let index = 0; index < restrictive.length; index++) {
  //     const element = restrictive[index];
  //     new_restricitve.push({left:left+element[0]/2,top:top+element[1]/2})

  //   }
  //   return new_restricitve;

  // }

  isPointInPolygon(left, top) {

    const x = left;
    const y = top;

    for (let index = 0; index < this.polygon.length; index++) {
      const element = this.polygon[index];
      let inside = false;
      for (var i = 0, j = element.length - 1; i < element.length; j = i++) {
        let xi = element[i][0], yi = element[i][1];
        let xj = element[j][0], yj = element[j][1];

        const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      if (inside) {
        return inside;
      }
    }
    return false;
  }

  render_assets() {
    this.httpClient.get('assets/location4.json').subscribe((data: any) => {
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let p = element['restricted_polygon']
        delete element['restricted_polygon']
        this.asset_coord.push(element)
        if (p.length > 0) {
          this.polygon.push(p)
        }
      }
    })
  }

  keydown_handler(e) {
    e.preventDefault();

    const key_code = e.which || e.keyCode;
    let possible_conflicts = [];
    let is_within_map_boundary = false;

    let proposed_position: any = {};

    switch (key_code) {
      case 37: // left

        proposed_position = {
          x: this.my_location.x - this.step_count,
          y: this.my_location.y
        }

        possible_conflicts.push({
          x: this.my_location.x - this.step_count,
          y: this.my_location.y
        });

        possible_conflicts.push({
          x: this.my_location.x - this.step_count,
          y: this.my_location.y + this.character_height
        });

        is_within_map_boundary = this.my_location.x - this.step_count > 0

        break;
      case 38: // up

        proposed_position = {
          x: this.my_location.x,
          y: this.my_location.y - this.step_count
        }

        possible_conflicts.push({
          x: this.my_location.x,
          y: this.my_location.y - this.step_count
        });

        possible_conflicts.push({
          x: this.my_location.x + this.character_width,
          y: this.my_location.y - this.step_count
        });

        is_within_map_boundary = this.my_location.y - this.step_count > 0

        break;
      case 39: // right

        proposed_position = {
          x: this.my_location.x + this.step_count,
          y: this.my_location.y
        }

        possible_conflicts.push({
          x: this.my_location.x + this.character_width + this.step_count,
          y: this.my_location.y
        });

        possible_conflicts.push({
          x: this.my_location.x + this.character_width + this.step_count,
          y: this.my_location.y + this.character_height
        });

        is_within_map_boundary = this.my_location.x + this.character_width + this.step_count < this.map_width;

        break;
      case 40: // down

        proposed_position = {
          x: this.my_location.x,
          y: this.my_location.y + this.step_count
        }

        possible_conflicts.push({
          x: this.my_location.x,
          y: this.my_location.y + this.character_height + this.step_count
        });

        possible_conflicts.push({
          x: this.my_location.x + this.character_width,
          y: this.my_location.y + this.character_height + this.step_count
        });

        is_within_map_boundary = this.my_location.y + this.character_height + this.step_count < this.map_height;

        break;
      default:
        return; // exit this handler for other keys
    }

    if (is_within_map_boundary) {

      let is_proposed_position_valid = true;
      possible_conflicts.forEach((position) => {
        if (this.isPointInPolygon(position.x, position.y)) {
          is_proposed_position_valid = false
          return;
        }
      });

      if (is_proposed_position_valid) {
        $('.character').dequeue().animate({
          left: proposed_position.x + 'px',
          top: proposed_position.y + 'px'
        }, this.character_animation_time);

        this.my_location = proposed_position;

        this.resetMapScope(this.my_location);

      }
    }
  }

  resetMapScope(location) {
    let scroll_left = $(document).scrollLeft();
    let scroll_top = $(document).scrollTop();

    const current_map_scope_left = this.window_width + scroll_left;
    const current_map_scope_top = this.window_height + scroll_top;


    console.log("window_height", this.window_height, this.window_width, this.my_location, current_map_scope_left, current_map_scope_top)
  }

  resize_handler(e) {
    this.window_height = e.currentTarget.innerHeight;
    this.window_width = e.currentTarget.innerWidth;
  }

  ngOnDestroy() {
    this.IsComponentDestroying.next();
  }

  ngOnInit() {

    this.render_assets();

    fromEvent(document.body, 'keydown').pipe(takeUntil(this.IsComponentDestroying)).subscribe(this.keydown_handler.bind(this));
    fromEvent(window, 'resize').pipe(takeUntil(this.IsComponentDestroying)).subscribe(this.resize_handler.bind(this));
    fromEvent(window, 'load').pipe(takeUntil(this.IsComponentDestroying)).subscribe(this.resize_handler.bind(this));

    // $(document).on('keydown', this.keydown_handler);
    this.twilioToken();

  }

  ngAfterViewInit() {
    this.common.twilio.localVideo = this.localVideo;
    this.common.twilio.r.push(this.remoteVideo);
    this.common.twilio.r.push(this.remoteVideo1);
    this.common.twilio.r.push(this.remoteVideo2);
    this.common.twilio.r.push(this.remoteVideo3);
    this.common.twilio.r.push(this.remoteVideo4);
    this.common.twilio.r.push(this.remoteVideo5);

    this.spawn_character(this.my_location)
  }

  spawn_character(location: Location) {
    console.log("mylocation inside spawsn", location)
    let character = {
      location: location,
      icon: "assets/images/map_assets/Asset1.png",
      id: Math.random()
    }
    this.characters.push(character);
    // this.update_character_position("", location, 0);
    this.render_characters(this.characters, () => {
      // all characters rendered. update location
      // this.update_character_position(character.id, location);
    });
  }

  render_characters(characters, cb = null) {
    const jquery_character_wrapper = $('.character-wrapper');
    jquery_character_wrapper.html("");
    characters.forEach((character) => {
      jquery_character_wrapper.append('<div style="top:' + character.location.y + 'px;left:' + character.location.x + 'px" id="' + character.id + '" class="character"> <img src="' + character.icon + '"  > </div>'
      );
    })
    if (cb) {
      cb();
    }
  }

  update_character_position(char_id, location: Location, animate = this.character_animation_time) {
    console.log(location, "spawn loction")
    $('.character#' + char_id).dequeue().animate({
      left: location.x + 'px',
      top: location.y + 'px'
    }, animate);
  }

  twilioToken() {
    console.log('hello')
    let storage = JSON.parse(localStorage.getItem('token') || '{}');
    let date = Date.now();
    console.log('at down')
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
        console.log(resp, 'in the api part')
        this.access_token = resp.data['token'];
        console.log(this.access_token, 'access_token')
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
            video: {width: 240}
          })
      },
      error => console.log(JSON.stringify(error)));

  }


}
