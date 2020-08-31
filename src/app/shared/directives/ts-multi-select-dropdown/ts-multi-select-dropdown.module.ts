import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TsMultiSelectDropdownComponent} from './ts-multi-select-dropdown.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatSelectModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';

export interface TsMultiSelectDropdownConfig {
  extraPayload?: object;
  searchKey?: string;
  idField?: string;
  textField?: string;
  enableCheckAll?: boolean;
  searchPlaceholderText?: string;
  noDataAvailablePlaceholderText?: string;
  displayWith?: any;
}

@NgModule({
  declarations: [TsMultiSelectDropdownComponent],
  imports: [CommonModule, ReactiveFormsModule, NgxMatSelectSearchModule, MatSelectModule],
  exports: [TsMultiSelectDropdownComponent]
})
export class TsMultiSelectDropdownModule {

}

//// Example code to show multi select

// <ts-multi-select-dropdown required="true" appearance="outline" [formCtrl]="formCtrl" (optionSelected)="selected($event)"
//   [options]="personMultiSelectOptions"></ts-multi-select-dropdown>
//
// personMultiSelectOptions: TsMultiSelectDropdownOptionsClass;
// formCtrl = new FormControl();
//
// ngOnInit() {
//   this.personMultiSelectOptions = new TsMultiSelectDropdownOptionsClass(
//     {
//       searchPlaceholderText: 'Select Persons',
//       textField: 'first_name',
//       idField: '_id',
//       displayWith: (item) => {
//         return (item.first_name || '') + ' ' + (item.last_name || '');
//       }
//     },
//     this._common._api.apiUrl + '/person/listLite',
//     this._common._api);
// }
//
// selected(e) {
//   // console.log(e);
//   console.log(this.formCtrl.value);
// }
