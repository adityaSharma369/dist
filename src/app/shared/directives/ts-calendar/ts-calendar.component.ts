import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {TsCalendarWrapperClass} from '../../classes/ts-calendar-wrapper.class';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ts-calendar',
  templateUrl: './ts-calendar.component.html',
  styleUrls: ['./ts-calendar.component.scss']
})
export class TsCalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('contextMenu', {static: true}) contextMenu: ElementRef;
  calendar: TsCalendarWrapperClass;
  @Input() minDate;
  @Input() maxDate;
  @Input() disabledDates = [];
  @Input() selectedDates = [];
  @Input() canSelect = true;

  constructor(private _renderer: Renderer2) {
    this.calendar = new TsCalendarWrapperClass(
      {
        canSelect: this.canSelect,
        disabledDates: this.disabledDates,
        selectedDates: this.selectedDates,
        minDate: this.minDate,
        maxDate: this.maxDate
      },
      this._renderer);
  }

  ngAfterViewInit(): void {
    this.calendar.contextMenu = this.contextMenu;
  }

  ngOnInit(): void {
  }
}
