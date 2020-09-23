import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {environment} from 'src/environments/environment';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocketService extends Socket {
  protected socketID;
  protected connection;
  protected events: Subject<any>[] = [];
  protected connectionEvents: BehaviorSubject<any>[] = [];

  constructor() {

    super({url: environment.socket_url, options: {}});
    this.on('connect', () => {
      console.log('Socket Connected');
      this.connectionEvent('open').next(true);
    });

    this.on('disconnect', (reason) => {
      console.log('Socket Disconnected');
      this.connectionEvent('open').next(false);
      this.connectionEvent('close').next(true);
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.connect();
      }
    });
    this.on('error', (error) => {
      console.log('Socket Error :', error);
      this.connectionEvent('open').next(false);
      this.connectionEvent('error').next(error);
    });

    // this.on('pong', (ms) => {
    //   console.log('Socket latency :', ms + 'ms');
    //   this.connectionEvent('pong').next(ms);
    // });
    this.on('wildcard', (payload) => {

      const event = payload.event;
      payload = payload.data;
      if (this.events[event]) {
        this.events[event].next(payload);
      } else {
        // console.log('No Event Listeners for ', event);
      }
      const evtBits = event.split('.');
      if (evtBits.length === 2) {
        const baseEvt = evtBits[0] + '.*';
        const subEvt = evtBits[1];
        if (this.events[baseEvt]) {
          // console.log('Event Listener for ', baseEvt);
          payload.event = subEvt;
          this.events[baseEvt].next(payload);
        } else {
          // console.log('No Event Listeners for ' + baseEvt);
        }
      }
      if (evtBits.length === 3) {
        const baseEvt = evtBits[0] + '.*';
        const subBaseEvt = evtBits[0] + '.' + evtBits[1] + '.*';
        const subEvt = evtBits[1];
        const subSubEvt = evtBits[2];
        if (this.events[baseEvt]) {
          // console.log('Event Listener for ', baseEvt);
          payload.event = subEvt + '.' + subSubEvt;
          this.events[baseEvt].next(payload);
        } else {
          // console.log('No Event Listeners for ' + baseEvt);
        }
        if (this.events[subBaseEvt]) {
          payload.event = subSubEvt;
          this.events[subBaseEvt].next(payload);
        } else {
          // console.log('No Event Listeners for ' + subBaseEvt);
        }
      }
    });
  }

  public send(eventName: string, payload: any) {
    this.emit(eventName, payload);
  }

  connectionEvent(on): BehaviorSubject<any> {
    if (this.connectionEvents[on]) {
      return this.connectionEvents[on];
    } else {
      this.connectionEvents[on] = new BehaviorSubject(false);
      return this.connectionEvents[on];
    }
  }


  onEvent(event): Subject<any> {

    if (this.events[event]) {
      return this.events[event];
    } else {
      this.events[event] = new Subject();
      return this.events[event];
    }
  }

}
