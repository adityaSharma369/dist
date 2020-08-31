import * as moment from 'moment';
import {Moment} from 'moment';
import {ElementRef, HostListener, Renderer2} from '@angular/core';

export interface TsCalendarWrapperConfig {
  minDate?: string;
  maxDate?: string;
  disabledDates?: string[];
  selectedDates?: string[];
  contextMenuRef?: ElementRef;
  canSelect?: boolean;
}

export class TsCalendarWrapperClass {
  public contextMenu: ElementRef;
  dates = {};
  today: Moment;
  currentInstanceStart: Moment;
  currentMonthStart: Moment;
  currentMonthEnd: Moment;
  currentMonth;
  currentYear;
  weekRows = [];
  currentContextDate = '';

  weekDays = moment.weekdays();
  weekDaysShort = moment.weekdaysShort();
  weekDaysMin = moment.weekdaysMin();
  months = moment.months();
  monthsShort = moment.monthsShort();

  selectedDates = [];
  disabledDates = [];
  minDate = '';
  maxDate = '';
  canSelect = true;

  constructor(config: TsCalendarWrapperConfig = {}, private _renderer: Renderer2 = null) {

    if (config.canSelect) {
      this.canSelect = config.canSelect;
    }
    if (config.disabledDates) {
      this.disabledDates = config.disabledDates;
    }
    if (config.selectedDates) {
      this.selectedDates = config.selectedDates;
    }
    if (config.minDate) {
      this.minDate = config.minDate;
    }
    if (config.maxDate) {
      this.maxDate = config.maxDate;
    }
    if (config.contextMenuRef) {
      this.contextMenu = config.contextMenuRef;
    }

    this.today = moment();
    this.build();
  }

  build(date: Moment = moment()) {
    this.dates = {};
    this.currentInstanceStart = date.clone();
    const monthStart = date.clone();
    const monthEnd = date.clone();
    const today = this.today.clone().format('YYYY-MM-DD');
    monthStart.startOf('month');
    monthEnd.endOf('month');
    this.currentMonthStart = monthStart.clone();
    this.currentMonthEnd = monthEnd.clone();
    const start = monthStart.date();
    const end = monthEnd.date();
    const month = date.month();
    this.currentYear = date.year();
    this.currentMonth = month;
    // this.weekRows = Array(Math.ceil(end / 7)).fill(0).map((x, i) => i);
    const year = date.year();
    let weekNumber = 1;
    this.weekRows = [weekNumber];
    let dayNumber = 1;
    const minDate = moment(this.minDate || '').isValid() ? moment(this.minDate) : false;
    const maxDate = moment(this.maxDate || '').isValid() ? moment(this.maxDate) : false;
    for (let day = start; day <= end; day++) {
      const dateString = year + '-' + (((month + 1) < 10) ? '0' : '') + (month + 1) + '-' + ((day < 10) ? '0' : '') + day;
      const dateItem = moment(dateString);
      const weekDay = dateItem.clone().weekday();
      // console.log(dayNumber % 7);
      if (dayNumber % 7 === 0) {
        weekNumber++;
        this.weekRows.push(weekNumber);
      }
      if (!this.dates[weekNumber]) {
        this.dates[weekNumber] = [];
      }
      if (day === start) {
        for (let startEmpty = 1; startEmpty < weekDay + 1; startEmpty++) {
          // console.log(startEmpty, weekDay);
          this.dates[weekNumber].push(null);
        }
      }
      let isNotAvailable = false;
      if (minDate && maxDate) {
        isNotAvailable = !(dateItem.unix() > minDate.unix() && dateItem.unix() < maxDate.unix());
      } else if (minDate) {
        isNotAvailable = dateItem.unix() < minDate.unix();
      } else if (maxDate) {
        isNotAvailable = dateItem.unix() > maxDate.unix();
      }
      this.dates[weekNumber].push({
        date: dateString,
        day: dateItem.date(),
        dateMoment: dateItem,
        is_today: today === dateString,
        is_disabled: this.disabledDates.indexOf(dateString) !== -1,
        is_not_available: isNotAvailable
      });
      dayNumber = weekDay + 1;
      if (day === end) {
        for (let endEmpty = weekDay + 1; endEmpty < 7; endEmpty++) {
          this.dates[weekNumber].push(null);
        }
      }
    }
  }

  getPrevMonth() {
    this.build(this.currentInstanceStart.clone().add(-1, 'month'));
  }

  getNextMonth() {
    this.build(this.currentInstanceStart.clone().add(1, 'month'));
  }

  getToday() {
    this.build(this.today);
  }

  canNavigatePrevMonth() {
    const minDate = moment(this.minDate || '').isValid() ? moment(this.minDate) : false;
    return !minDate || (minDate && this.currentMonthStart.unix() > minDate.unix());
  }

  canNavigateNextMonth() {
    const maxDate = moment(this.maxDate || '').isValid() ? moment(this.maxDate) : false;
    return !maxDate || (maxDate && this.currentMonthEnd.unix() < maxDate.unix());
  }

  showContextMenu(show = true) {
    let mode = 'none';
    if (show) {
      mode = 'block';
    }
    if (this._renderer) {
      this._renderer.setStyle(this.contextMenu.nativeElement, 'display', mode);
    }
  }

  onContextMenu(e, day) {
    e.preventDefault();
    this.currentContextDate = day.date;
    const x = e.layerX;
    const y = e.layerY;
    if (this._renderer) {
      this._renderer.setStyle(this.contextMenu.nativeElement, 'top', y + 'px');
      this._renderer.setStyle(this.contextMenu.nativeElement, 'left', x + 'px');
      this.showContextMenu();
    }
  }

  @HostListener('click', [])
  onClick() {
    this.showContextMenu(false);
  }

  datesSelected(dates) {
  }

  daySelect(date) {
    const index = this.selectedDates.indexOf(date);
    if (index > -1) {
      this.selectedDates.splice(index, 1);
    } else {
      this.selectedDates.push(date);
    }
    this.datesSelected(this.selectedDates);
  }
}
