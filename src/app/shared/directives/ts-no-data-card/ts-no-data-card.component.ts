import {Component, Input, OnInit} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ts-no-data-card',
  templateUrl: './ts-no-data-card.component.html',
  styleUrls: ['./ts-no-data-card.component.scss']
})
export class TsNoDataCardComponent implements OnInit {
  @Input() icon = 'sentiment_very_dissatisfied';
  @Input() text = 'Nothing to show here';
  @Input() canShow = false;

  constructor() {
  }

  ngOnInit() {
  }

}
