import {Injectable} from '@angular/core';
import {TsConfirmationConfig} from './ts-confirmation-alert.module';
import {TsConfirmationAlertComponent} from './ts-confirmation-alert.component';

@Injectable({
  providedIn: 'root'
})
export class TsConfirmationAlertService {
  askConfirmationAlertBox: TsConfirmationAlertComponent;

  constructor() {

  }

  public ask(config: TsConfirmationConfig | any = {}) {
    this.askConfirmationAlertBox.askConfirmation(config);
    return new Promise((resolve, reject) => {
      this.askConfirmationAlertBox.confirm = () => {
        this.askConfirmationAlertBox.closeConfirmation();
        resolve();
      };
      this.askConfirmationAlertBox.cancel = () => {
        this.askConfirmationAlertBox.closeConfirmation();
        reject();
      };
    });
  }

  public close() {
    this.askConfirmationAlertBox.closeConfirmation();
  }
}
