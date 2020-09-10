import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { retry } from 'rxjs/operators';

@Component({
  selector: 'ts-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit{
  restrictive:any;
  constructor() {
  }
  // ngAfterViewInit() {
  //   this.restrictive = this.position_restrictive_items()
  //   console.log(this.restrictive);
  // }

  position_restrictive_items() {
    const restrictive = [];

    const elements:any = document.getElementsByClassName('restricted-wrapper');
    // console.log(elements,'c');
    Array.from(elements).forEach((el:any)=>{
      let children = el.children
      console.log(children,'c')
      Array.from(children).forEach((child:any)=>{
        let dimensions = child.getBoundingClientRect()
        restrictive.push([dimensions.left,dimensions.top,dimensions.right,dimensions.bottom]);
      })
    })
    return restrictive;
  }

  checkOverlap(rect1){
    // console.log(rect1)
    for (let index = 0; index < this.restrictive.length; index++) {
      let rect2 = this.restrictive[index];
      if(rect1[0] < rect2[2] && rect2[0] < rect1[2] && rect1[1] < rect2[3] && rect2[1] < rect1[3]){
        return true
      }
    }
    return false;
  }


  ngOnInit() {
    $(document).on('keydown', (e: any) => {
      const key_code = e.which || e.keyCode;
      const current_left = $('.my-character').css('left');
      const current_top = $('.my-character').css('top');
      const character_animation_time = 50;

      const left = parseFloat(current_left.replace('px', ''));
      const top = parseFloat(current_top.replace('px', ''));
      let element = document.getElementsByClassName('my-character')[0];
      if(this.restrictive === undefined){
        this.restrictive = this.position_restrictive_items();
        console.log('hello',this.restrictive);
      }
      // let element1 = document.getElementsByClassName('')[0];

      console.log(element.getBoundingClientRect(),'e');
      let dimensions = element.getBoundingClientRect();
      let rect = [dimensions.left,dimensions.top,dimensions.right,dimensions.bottom]
      console.log(dimensions,'reee')
      switch (key_code) {
        case 37: // left
          rect[0] -= 20;
          rect[2] -= 20;
          if(!this.checkOverlap(rect)){
            $('.my-character').dequeue().animate({left: '-=20px'}, character_animation_time);
          }
          break;
        case 38: // up
          // console.log(rect,'before')
          rect[1] -= 20
          rect[3] -= 20
          if(!this.checkOverlap(rect)){
            $('.my-character').dequeue().animate({top: '-=20px'}, character_animation_time);
          }
          break;
        case 39: // right
          rect[0] += 20;
          rect[2] += 20;
          if(!this.checkOverlap(rect)){
            $('.my-character').dequeue().animate({left: '+=20px'}, character_animation_time);
          }
          break;
        case 40: // down
          rect[1] += 20
          rect[3] += 20
          if(!this.checkOverlap(rect)){
            $('.my-character').dequeue().animate({top: '+=20px'}, character_animation_time);
          }
          break;
        default:
          return; // exit this handler for other keys
      }
      e.preventDefault();
    });
  }


}
