import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'ts-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit, AfterViewInit {

  constructor() {
  }

  ngAfterViewInit() {
    this.position_interactive_items();
  }

  position_interactive_items() {
    const interactive_items = [];

    $('.interactive-wrapper').children().each((elem) => {
      console.log(elem);
    });

    //   .forEach((elem: any) => {
    //   console.log(elem);
    // });

    return interactive_items;
  }


  ngOnInit() {

    $(document).on('keydown', (e: any) => {
      const key_code = e.which || e.keyCode;
      const current_left = $('.my-character').css('left');
      const current_top = $('.my-character').css('top');
      const character_animation_time = 50;

      const left = parseFloat(current_left.replace('px', ''));
      const top = parseFloat(current_top.replace('px', ''));

      switch (key_code) {
        case 37: // left
          $('.my-character').dequeue().animate({left: '-=20px'}, character_animation_time);
          break;
        case 38: // up
          $('.my-character').dequeue().animate({top: '-=20px'}, character_animation_time);
          break;
        case 39: // right
          $('.my-character').dequeue().animate({left: '+=20px'}, character_animation_time);
          break;
        case 40: // down
          $('.my-character').dequeue().animate({top: '+=20px'}, character_animation_time);
          break;
        default:
          return; // exit this handler for other keys
      }
      e.preventDefault();
    });
  }


}
