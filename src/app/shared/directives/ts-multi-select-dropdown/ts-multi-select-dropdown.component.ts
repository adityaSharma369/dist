import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {TsMultiSelectDropdownOptionsClass} from './ts-multi-select-dropdown-options.class';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime, filter, map, takeUntil, tap} from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ts-multi-select-dropdown',
  templateUrl: './ts-multi-select-dropdown.component.html',
  styleUrls: ['./ts-multi-select-dropdown.component.scss']
})
export class TsMultiSelectDropdownComponent implements OnInit, OnDestroy {
  @Input() options: TsMultiSelectDropdownOptionsClass;
  @Input() appearance = 'standard';
  @Input() required = false;
  @Input() formCtrl: FormControl = new FormControl();
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();

  public searching = false;
  public serverSideFilteringCtrl: FormControl = new FormControl();
  public filteredData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor() {
  }

  ngOnInit() {

    // listen for search field value changes
    this.serverSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          const payload: any = {};
          payload[this.options.config.searchKey] = search;

          Object.keys(this.options.config.extraPayload).forEach((payloadKey) => {
            payload[payloadKey] = this.options.config.extraPayload[payloadKey];
          })
          
          // simulate server fetching and filtering data
          return this.options._apiService.post(this.options._apiUrl, payload)
            .subscribe((resp) => {
              this.searching = false;
              const data = resp.data || [];
              const finalData = [];
              const alreadyIdInList = [];
              if (this.formCtrl && this.formCtrl.value) {
                finalData.push(...this.formCtrl.value);
              }
              finalData.forEach((item) => {
                alreadyIdInList.push(item[this.options.config.idField]);
              });
              data.forEach((item) => {
                if (alreadyIdInList.indexOf(item[this.options.config.idField]) === -1) {
                  finalData.push(item);
                }
              });
              this.filteredData.next(finalData);
            });
        })
      ).subscribe();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onItemSelect(e) {
  }

  onValueChange(val) {
    setTimeout(() => {
      this.optionSelected.emit(val);
    }, 10);
  }

  toggleAll(e) {
    console.log(e);
  }
}


