import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {CommonService} from './common.service';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {
  constructor(private _common: CommonService) {

    super({url: environment.socket_url, options: {}});
    this.on('connect', () => {
      console.log('Socket Connected');
    });

    this.on('disconnect', (status) => {
      console.log('Socket Disconnected :', status);
    });
    this.on('error', (status) => {
      console.log('Socket Error :', status);
    });
  }

  public send(event, msg) {
    const observable = new Observable<any>();
    this.emit(event, msg, (status) => {
      observable.forEach(() => status);
    });
    return observable;
  }

  public onEvent(event) {
    return this.fromEvent(event);
  }

}
