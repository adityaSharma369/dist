import {Injectable} from '@angular/core';
import {TsMultiOptionsConfig} from './ts-multi-options-alert.module';
import {TsMultiOptionsAlertComponent} from './ts-multi-options-alert.component';

@Injectable({
  providedIn: 'root'
})
export class TsMultiOptionsAlertService {
  askOptionsAlertBox: TsMultiOptionsAlertComponent;

  constructor() {

  }

  public ask(config: TsMultiOptionsConfig | any = {}) {
    this.askOptionsAlertBox.askOptions(config);
    return new Promise((resolve, reject) => {
      this.askOptionsAlertBox.cancel = () => {
        this.askOptionsAlertBox.closeOptions();
        reject();
      };
      this.askOptionsAlertBox.selected = (key) => {
        this.askOptionsAlertBox.closeOptions();
        resolve(key);
      };
    });
  }
  public close() {
    this.askOptionsAlertBox.closeOptions();
  }
}
