import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {ApiService} from '../services/api.service';

export interface TsAutocompleteConfig {
  formCtrl: FormControl;
  url?: string;
  response?: any;
  payloadKey?: any;
  displayWith?: any;
  optionList: string[];
}


export class TsAutocompleteWrapperClass {

  formCtrl = new FormControl();
  public data: Observable<string | any[]>;

  config: TsAutocompleteConfig = {
    formCtrl: new FormControl(),
    url: null,
    response: (resp) => {
      return resp.data;
    },
    payloadKey: 'search',
    displayWith: (item) => {
      return (item && item.name) ? item.name : item;
    },
    optionList: []
  };


  constructor(config: TsAutocompleteConfig | any = {}, public _apiService: ApiService) {
    this.config = {...this.config, ...config};
    if (this.config.formCtrl) {
      this.formCtrl = this.config.formCtrl;
    }
    this.data = this.formCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((val) => {
          return this._filter(val || '');
        })
      );
  }

  public _filter(value: string): Observable<any[]> | string[] {
    let filterValue;
    if (value.length > 0) {
      filterValue = value.toLowerCase();
    }
    if (value === '') {
      return [];
    }
    if (typeof value === 'string') {
      if (this.config.url) {
        const payload = {};
        payload[this.config.payloadKey] = value;
        return this._apiService.post(this.config.url, payload)
          .pipe(
            map(this.config.response)
          );
      } else {
        return this.config.optionList.filter(option => option.toLowerCase().includes(filterValue));
      }
    } else {
      return [];
    }
  }
}


// <mat-form-field appearance="outline">
//   <mat-label>PCB</mat-label>
//   <input matInput required [formControl]="pcbControl.formCtrl" [matAutocomplete]="autoPcb">
//   <mat-autocomplete #autoPcb="matAutocomplete" [displayWith]="pcbControl.config.displayWith">
// <mat-option *ngFor="let option of pcbControl.data | async" [value]="option">
//   {{pcbControl.config.displayWith(option)}}
// </mat-option>
// </mat-autocomplete>
// </mat-form-field>

// this.pcbControl = new TsAutocompleteWrapper({
//   url: this._common._apiService.apiUrl + '/pcb/lite', template: (resp) => {
//     return resp.data;
//   }, payloadKey: 'search',
//   displayWith: (item) => {
//     return (item && item.human_uid) ? item.human_uid : undefined;
//   }
// }, [], this._common);
