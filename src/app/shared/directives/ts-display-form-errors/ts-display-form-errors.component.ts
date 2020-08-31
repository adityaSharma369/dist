import {Component, Input, OnInit} from '@angular/core';

export interface TsErrorMessageTypes {
  required: string;
  email: string;
  minlength: string;
  maxlength: string;
  pattern: string;
  min: string;
  max: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ts-display-form-errors',
  templateUrl: './ts-display-form-errors.component.html',
  styleUrls: ['./ts-display-form-errors.component.scss']
})
export class TsDisplayFormErrorsComponent implements OnInit {
  @Input() errors: any = {};
  @Input() messages: TsErrorMessageTypes | any = {};

  constructor() {
  }

  ngOnInit() {
  }

}
