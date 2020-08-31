import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet} from '@angular/material';
import {TsMultiOptionItem, TsMultiOptionsConfig} from './ts-multi-options-alert.module';
import {TsMultiOptionsAlertService} from './ts-multi-options-alert.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ts-multi-options-alert',
  templateUrl: './ts-multi-options-alert.component.html',
  styleUrls: ['./ts-multi-options-alert.component.scss']
})
export class TsMultiOptionsAlertComponent implements OnInit, AfterViewInit {
  headingText = 'Please select any option';
  descriptionText = '';
  optionsList: TsMultiOptionItem[] | any[] = [];
  @ViewChild('template', {static: false}) template: TemplateRef<any>;

  constructor(private _openBottomSheet: MatBottomSheet, private _confirm: TsMultiOptionsAlertService) {
  }

  askOptions(config: TsMultiOptionsConfig | any = []) {
    if (config.title) {
      this.headingText = config.title;
    }
    if (config.description) {
      this.descriptionText = config.description;
    }
    if (config.options) {
      this.optionsList = config.options;
    }
    const ref = this._openBottomSheet.open(this.template);
    ref.backdropClick().subscribe(() => {
      this.cancel();
    });
  }

  closeOptions() {
    this._openBottomSheet.dismiss();
  }

  ngAfterViewInit(): void {
    this._confirm.askOptionsAlertBox = this;
  }

  ngOnInit() {
  }

  cancel() {
  }

  selected(key) {

  }
}
