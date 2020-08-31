import {Injectable} from '@angular/core';
import {ToastaConfig, ToastaService, ToastData, ToastOptions} from 'ngx-toasta';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private _toasta: ToastaService, private toastaConfig: ToastaConfig) {
    this.toastaConfig.theme = 'material';
  }

  public showAlert(text: string, alertType: string, heading = null, timeout = 4000, cb = null) {
    const toastOptions: ToastOptions = {
      title: heading || alertType,
      msg: text,
      showClose: true,
      timeout,
      theme: 'material',
      onAdd: (toast: ToastData) => {
        if (cb) {
          cb('added');
        }
      },
      onRemove(toast: ToastData) {
        if (cb) {
          cb('removed');
        }
      }
    };
    switch (alertType) {
      case 'default':
        this._toasta.default(toastOptions);
        break;
      case 'info':
        this._toasta.info(toastOptions);
        break;
      case 'success':
        this._toasta.success(toastOptions);
        break;
      case 'wait':
        this._toasta.wait(toastOptions);
        break;
      case 'error':
        this._toasta.error(toastOptions);
        break;
      case 'warning':
        this._toasta.warning(toastOptions);
        break;
    }
  }

}
