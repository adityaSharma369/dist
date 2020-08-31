import {Injectable} from '@angular/core';
import {CommonService} from './common.service';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(private _common: CommonService, private _route: ActivatedRoute) {
  }

  checkLogin(cb = null) {
    this._common._api.get(this._common._api.apiUrl + '/account/checkLogin').subscribe((resp: any) => {
      if (resp && resp.success) {
        const authObj: any = resp.data;
        authObj.token = this._common._auth.token;
        this._common._auth.afterLogin(authObj);
      } else {
        this._common._auth.logout();
      }
      if (cb) {
        cb(resp);
      }
    }, (err) => {
      if (cb) {
        cb(err);
      }
    });
  }

  // 3rd party api calls starts bellow
}
