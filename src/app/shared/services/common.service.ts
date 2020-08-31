import {Injectable, NgZone, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatBottomSheet, MatDialog} from '@angular/material';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {AlertService} from './alert.service';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {DataService} from './data.service';
import {Lightbox} from 'ngx-lightbox';
import {environment} from '../../../environments/environment';
import {Subject} from 'rxjs';
import {TsConfirmationAlertService} from '../directives/ts-confirmation-alert/ts-confirmation-alert.service';
import {TsMultiOptionsAlertService} from '../directives/ts-multi-options-alert/ts-multi-options-alert.service';
import {Location} from '@angular/common';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  _mobileQuery: MediaQueryList;
  _showPageLoading: Subject<any> = new Subject();
  todayDate = moment();

  constructor(public _auth: AuthService,
              public _api: ApiService,
              public _router: Router,
              public _data: DataService,
              public _lightbox: Lightbox,
              public _fb: FormBuilder,
              public _zone: NgZone,
              public _alert: AlertService,
              public _confirm: TsConfirmationAlertService,
              public _options: TsMultiOptionsAlertService,
              private _dialog: MatDialog,
              private _location: Location,
              private _bottomSheet: MatBottomSheet,
              private _sanitizer: DomSanitizer) {
  }

  public static createBlobUrlWithText(text) {
    const blob = new Blob([text]);
    // Obtain a blob URL reference to our worker 'file'.
    return window.URL.createObjectURL(blob); // window.URL.revokeObjectURL(blobURL); remove
  }

  public static getBytesInMB(bytes) {
    return bytes / (1024 * 1024);
  }


  static formatSizeUnits(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  public static getRandomID(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  showFormValidationErrors(err, form: FormGroup) {
    for (const control in err.errors) {
      if (err.errors.hasOwnProperty(control)) {
        if (form.controls[control]) {
          form.controls[control].markAsTouched();
          form.controls[control].setErrors({custom: {error: err.errors[control][0]}});
        } else {
          this._alert.showAlert(err.errors[control][0], 'error', control);
        }
      }
    }
  }

  public getColor(i) {
    return this._data.colorArray[i];
  }

  goBackInHistory() {
    this._location.back();
  }

  getSanitizer() {
    return this._sanitizer;
  }

  public navigateToUrlWithParams(url, query = null) {
    if (query) {
      return this._router.navigate([url], {queryParams: query});
    } else {
      return this._router.navigateByUrl(url);
    }
  }

  _showLoading() {
    this._showPageLoading.next(true);
  }

  _hideLoading() {
    this._showPageLoading.next(false);
  }

  public _openBottomSheet(template: TemplateRef<any>, panelClass = '', announce = false): void {
    const ref = this._bottomSheet.open(template, {
      panelClass: panelClass
    });
    
    if (!environment.production) {
      ref.afterOpened().subscribe(result => {
        if (announce) {
          console.log('The _bottomSheet was opened');
        }
      });
      ref.backdropClick().subscribe(result => {
        if (announce) {
          console.log('The _bottomSheet was backdrop clicked');
        }
      });
      ref.afterDismissed().subscribe(result => {
        if (announce) {
          console.log('The _bottomSheet was closed');
        }
      });
    }
  }

  public _closeBottomSheet() {
    this._bottomSheet.dismiss();
  }

  public _openDialog(template, width = '400px', cb = null, announce = false) {
    const dialogRef = this._dialog.open(template, {
      width,
    });

    if (!environment.production) {
      dialogRef.afterOpened().subscribe(result => {
        if (announce) {
          console.log('The dialog was opened');
        }
      });
      dialogRef.backdropClick().subscribe(result => {
        if (announce) {
          console.log('The dialog was backdrop clicked');
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (announce) {
          console.log('The dialog was closed');
        }
        if (cb) {
          cb();
        }
      });
    }
  }

  public _closeDialog(ref = null) {
    if (ref) {
      ref.close();
    } else {
      this._dialog.closeAll();
    }
  }

  public convert12HoursFormatTo24HoursFormat(time12h) {
    const [time, modifier] = time12h.split(' ');

    // tslint:disable-next-line:prefer-const
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  public compareTwoObjects = (item1, item2) => {
    if (!item1 || !item2) {
      return false;
    }
    return item1._id === item2._id;
  };

  getDatesInObjects(dateObjects): string[] {
    if (!dateObjects) {
      return [];
    }
    const dates = [];
    dateObjects.forEach((leave, index) => {
      if (index > 0) {
        // dates += ', ';
      }
      dates.push(moment(leave.date).format('YYYY-MM-DD'));
    });
    return dates.sort((a, b) => {
      a = new Date(a);
      b = new Date(b);
      return a - b;
    });
  }

  getStringOfDates(dates): string {
    let text = '';
    const currentYear = new Date().getFullYear();
    const months = moment.monthsShort();
    dates.forEach((date, i) => {
      const d = new Date(date);
      if (i > 0) {
        text += ', ';
      }
      text += months[d.getMonth()] + ' ' + d.getDate() + ((currentYear !== d.getFullYear()) ? ', ' + d.getFullYear() : '');
    });
    return text.trim();
  }

  getSpecialStringOfDates(dates): string {
    let text = '';
    const months = moment.monthsShort();
    const breakUp = this.getDatesBreakUp(dates);
    let monthIndex = 0;
    for (const year in breakUp) {
      if (breakUp.hasOwnProperty(year)) {
        for (const month in breakUp[year]) {
          if (breakUp[year].hasOwnProperty(month)) {
            breakUp[year][month].forEach((day, i) => {
              if (i > 0) {
                text += ', ';
              }
              text += day + '';
            });
            text += ' ' + months[month] + ' ' + year + ', ';
            monthIndex++;
          }
        }
        // text += year + ' | ';
        // yearIndex++;
      }
    }
    return text.trim();
  }

  getDatesBreakUp(dates): any {
    const breakUp = {};
    const monthObj = {};
    dates.forEach((date) => {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth();
      const year = d.getFullYear();
      if (!breakUp[year]) {
        breakUp[year] = {};
      }
      if (!breakUp[year][month]) {
        breakUp[year][month] = [];
      }
      breakUp[year][month].push(day);
    });
    return breakUp;
  }
}
