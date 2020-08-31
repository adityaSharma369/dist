import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketsService {
  protected socketID;
  protected connection;
  protected events: Subject<any>[] = [];
  protected connectionEvents: BehaviorSubject<any>[] = [];

  constructor(private _auth: AuthService) {
    this.connection = new WebSocket(environment.socket_url);
    this.connection.onclose = (evt) => {
      if (evt.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${evt.code} reason=${evt.reason}`);
      } else {
        console.log(evt);
      }
      this.connectionEvent('close').next(evt);
    };
    this.connection.onopen = (connected) => {
      // console.log(connected);
      this.connectionEvent('open').next(connected);
    };
    this.connection.onerror = (err) => {
      console.log(err);
      this.connectionEvent('error').next(err);
    };
    this.on('handshake.success').subscribe((data) => {
      this.socketID = data.id;
    });
    this.connection.onmessage = (evt) => {
      const payload = JSON.parse(evt.data);
      const event = payload.event;
      if (this.events[event]) {
        this.events[event].next(payload);
      } else {
        console.log('No Event Listeners for ', event);
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
          console.log('No Event Listeners for ' + baseEvt);
        }
        if (this.events[subBaseEvt]) {
          payload.event = subSubEvt;
          this.events[subBaseEvt].next(payload);
        } else {
          console.log('No Event Listeners for ' + subBaseEvt);
        }
      }
    };
  }

  connectionEvent(on): BehaviorSubject<any> {
    if (this.connectionEvents[on]) {
      return this.connectionEvents[on];
    } else {
      this.connectionEvents[on] = new BehaviorSubject(false);
      return this.connectionEvents[on];
    }
  }

  on(event): Subject<any> {
    if (this.events[event]) {
      return this.events[event];
    } else {
      this.events[event] = new Subject();
      return this.events[event];
    }
  }

  connect() {
    this.send('user.login', {user_id: this._auth.user._id});
  }

  send(event, data) {
    this.connection.send(JSON.stringify({
      event,
      body: data,
      id: this.socketID
    }));
  }

  getSocketId() {
    return this.socketID;
  }
}
