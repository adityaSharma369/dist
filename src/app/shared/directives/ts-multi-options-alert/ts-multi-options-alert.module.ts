import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TsMultiOptionsAlertComponent} from './ts-multi-options-alert.component';
import {MatBottomSheetModule, MatButtonModule} from '@angular/material';

export interface TsMultiOptionItem {
  text: string;
  color: string;
  key: string;
}

export interface TsMultiOptionsConfig {
  title: string;
  description: string;
  options: TsMultiOptionItem[] | any[];
}

@NgModule({
  declarations: [TsMultiOptionsAlertComponent],
  imports: [
    CommonModule, MatBottomSheetModule, MatButtonModule
  ],
  exports: [TsMultiOptionsAlertComponent]
})
export class TsMultiOptionsAlertModule {
}


//// Example code to show options

// const optionsConfig: TsMultiOptionsConfig = {
//   options: [
//     {key: 'today', color: 'primary'},
//     {key: 'tomorrow', color: 'accent'},
//     {key: 'next_week', text: 'next week'},
//     {key: 'next_month', text: 'next month', color: 'warn'},
//   ],
//   title: 'when are you coming to work?',
//   description: 'your choice'
// };
// this._common._options.ask(optionsConfig).then((state) => {
//   console.log(state);
//   switch (state) {
//     case 'today':
//       break;
//     case 'tomorrow':
//       break;
//     case 'next_week':
//       break;
//     case 'next_month':
//       break;
//   }
// }).catch(() => {
//   console.log('rejected');
// });
