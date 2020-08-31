import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet} from '@angular/material';
import {TsConfirmationAlertService} from './ts-confirmation-alert.service';
import {TsConfirmationConfig, TsConfirmationItem} from './ts-confirmation-alert.module';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ts-confirmation-alert',
  templateUrl: './ts-confirmation-alert.component.html',
  styleUrls: ['./ts-confirmation-alert.component.scss']
})
export class TsConfirmationAlertComponent implements OnInit, AfterViewInit {
  confirmationText = 'Are you sure ?';
  yes: TsConfirmationItem | any = {text: 'Yes, Confirm'};
  no: TsConfirmationItem | any = {text: 'No, Cancel', color: 'primary'};
  @ViewChild('template', {static: false}) template: TemplateRef<any>;

  constructor(private _openBottomSheet: MatBottomSheet, private _confirm: TsConfirmationAlertService) {
  }

  askConfirmation(config: TsConfirmationConfig | any = {}) {
    if (config.confirmationText) {
      this.confirmationText = config.confirmationText;
    }
    if (config.yes) {
      this.yes = config.yes;
    }
    if (config.no) {
      this.no = config.no;
    }
    const ref = this._openBottomSheet.open(this.template);
    ref.backdropClick().subscribe(() => {
      this.cancel();
    });
  }

  closeConfirmation() {
    this._openBottomSheet.dismiss();
  }

  ngAfterViewInit(): void {
    this._confirm.askConfirmationAlertBox = this;
  }

  ngOnInit() {
  }

  cancel() {
  }

  confirm() {
  }
}
