import {NgModule} from '@angular/core';
import {TsConfirmationAlertComponent} from './ts-confirmation-alert.component';
import {MatBottomSheetModule, MatButtonModule} from '@angular/material';
import {CommonModule} from '@angular/common';

export interface TsConfirmationItem {
  color: string;
  text: string;
}

export interface TsConfirmationConfig {
  no: TsConfirmationItem | any;
  yes: TsConfirmationItem | any;
  confirmationText: string;
}

@NgModule({
  declarations: [TsConfirmationAlertComponent],
  imports: [CommonModule, MatBottomSheetModule, MatButtonModule],
  exports: [TsConfirmationAlertComponent],
})
export class TsConfirmationAlertModule {
  constructor() {
  }
}

/// Example code to run confirm

// this._common._confirm.ask().then(() => {
//   // on confirmed
// }).catch(() => {
//   // if not confirmed
// });
