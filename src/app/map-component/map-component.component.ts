import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as $ from 'jquery';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { retry } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http'
import {CommonService} from '../shared/services/common.service';
import { parse } from 'querystring';
// import * as data from './../../location.json';
@Component({
  selector: 'ts-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit,AfterViewInit {
  polygon:any[] = [];
  asset_coord:any[] = [];
  access_token:any;
  

  @ViewChild("localVideo",{ static: true }) localVideo:ElementRef;
  @ViewChild("remoteVideo",{ static: true }) remoteVideo:ElementRef;
  @ViewChild("remoteVideo1",{ static: true }) remoteVideo1:ElementRef;
  @ViewChild("remoteVideo2",{ static: true }) remoteVideo2:ElementRef;
  @ViewChild("remoteVideo3",{ static: true }) remoteVideo3:ElementRef;
  @ViewChild("remoteVideo4",{ static: true }) remoteVideo4:ElementRef;
  @ViewChild("remoteVideo5",{ static: true }) remoteVideo5:ElementRef;


  // cornersX:any[] = []
  // cornersY:any[] = []
  constructor(private httpClient:HttpClient,private common:CommonService) {
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

  checkInside(left,top){
    console.log(left,top,'yo')
    // console.log(this.polygon,'in checkInside')
    const x = left; 
    const y  = top;

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
      if(inside){
        return inside;
      }
    }
    return false;
  }


  ngOnInit() {
    this.httpClient.get('assets/location4.json').subscribe((data:any)=>{

      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        let p = element['restricted_polygon']
        delete element['restricted_polygon']
        this.asset_coord.push(element)
        if(p.length > 0){
          this.polygon.push(p)
        }
      }
      console.log(this.asset_coord);
      console.log(this.polygon)
      // console.log(data)
      // this.location = data;
      // // console.log(data);
      // // this.location = data['Tree']
      // // Object.keys(data).forEach(element => {
      // //   data[element].forEach(val => {
      // //     this.location.push(val)
      // //   });
      // //   // this.location.push(data[element])
      // //   // console.log(element)
      // // });
      // console.log(this.location)
    })
    $(document).on('keydown', (e: any) => {
      const key_code = e.which || e.keyCode;
      const current_left = $('.my-character').css('left');
      const current_top = $('.my-character').css('top');
      const current_width = $('.my-character').css('width');
      const current_height = $('.my-character').css('height');
      const character_animation_time = 50;

      const left = parseFloat(current_left.replace('px', ''));
      const top = parseFloat(current_top.replace('px', ''));
      const width = parseFloat(current_width.replace('px', ''));
      const height = parseFloat(current_height.replace('px,',''));
      console.log(width,height,'right');
      // let element1 = document.getElementsByClassName('')[0];

      // console.log(element.getBoundingClientRect(),'e');
      switch (key_code) {
        case 37: // left
            if(!this.checkInside(left-20,top) && !(this.checkInside(left-20,top+height))){
              $('.my-character').dequeue().animate({left: '-=20px'}, character_animation_time);
            }
          break;
        case 38: // up
          // console.log(rect,'before')
            if(!this.checkInside(left,top-20) && !this.checkInside(left+width,top-20) && top-20 > 0){
              $('.my-character').dequeue().animate({top: '-=20px'}, character_animation_time);
            }
          break;
        case 39: // right
          if(!this.checkInside(left+width+20,top) && !this.checkInside(left+width+20,top+height)){
            $('.my-character').dequeue().animate({left: '+=20px'}, character_animation_time);
          }
          break;
        case 40: // down
            if(!this.checkInside(left,top+height+20) && !this.checkInside(left+width,top+height+20)){
              $('.my-character').dequeue().animate({top: '+=20px'}, character_animation_time);
            }
          break;
        default:
          return; // exit this handler for other keys
      }
      e.preventDefault();
    });
    this.twilioToken();

  }

  ngAfterViewInit(){
    this.common.twilio.localVideo = this.localVideo;
    this.common.twilio.r.push(this.remoteVideo);
    this.common.twilio.r.push(this.remoteVideo1);
    this.common.twilio.r.push(this.remoteVideo2);
    this.common.twilio.r.push(this.remoteVideo3);
    this.common.twilio.r.push(this.remoteVideo4);
    this.common.twilio.r.push(this.remoteVideo5);


  }

  twilioToken(){
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

    this.common._api.get(this.common._api.apiUrl+'/generateToken').subscribe((resp:any) => {
      console.log(resp,'in the api part')
      this.access_token = resp.data['token'];
      console.log(this.access_token,'access_token')
      // this.username = d['username'];
      localStorage.setItem('token', JSON.stringify({
        token: this.access_token,
        // username:this.username,
        created_at: date
      }));

      this.common.twilio.connectToRoom(this.access_token, 
        { name: 'test', 
          audio: true, 
          video: { width: 240 } 
        })
    },
      error => console.log(JSON.stringify(error)));
    
  }


}
