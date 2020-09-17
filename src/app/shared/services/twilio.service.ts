import {Injectable, EventEmitter, ElementRef} from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Observer} from 'rxjs';
import {connect, createLocalTracks, createLocalVideoTrack} from 'twilio-video';
import {BehaviorSubject} from 'rxjs';


@Injectable()
export class TwilioService {

  r: ElementRef[] = [];
  localVideo: ElementRef;
  previewing: boolean;
  roomObj: any;
  person: Map<string, number>;
  another: Map<number, string>;
  count: number;

  constructor() {
    this.person = new Map();
    this.another = new Map();
    this.count = 0;
    console.log(this.person, 'thsss');
  }

  dynamic_users = {};

  // track_identities = {};

  subscribed(track, element, participant) {
    let elem;
    let user_uid = participant.identity;
    console.log(element, 'e', participant)
    if (this.dynamic_users[user_uid] == undefined) {
      elem = document.createElement('div');
      elem.setAttribute('class', 'remote-video-item');
      elem.setAttribute('id', 'remote-video-' + user_uid);
      this.dynamic_users[user_uid] = elem
    } else {
      elem = this.dynamic_users[user_uid];
    }

    elem.append(track.attach());
    element.nativeElement.appendChild(elem);
    // console.log('Subscribed to RemoteTrack:', track.sid);
  }

  unsubscribed(participant, track) {
    let user_uid = participant.identity;
    const elem = document.getElementById('remote-video-' + user_uid);
    track.detach().forEach((element) => {
      element.remove();
    })
    if (elem && elem.children.length <= 1) {
      elem.remove(); // check children count later
    }
    console.log('Unsubscribed to RemoteTrack:', track.sid);
  }

  listenToSubscriptionEvents(publication, element, participant) {
    let e = element
    console.log(e, 'in listen')
    publication.on('subscribed', (track) => {
      this.subscribed(track, e, participant)
    });
    publication.on('unsubscribed', this.unsubscribed.bind(null, participant));
    // publication.on('subscriptionFailed', subscriptionFailed);
  }

  participantConnected(participant) {
    console.log(participant.identity, 'PIII');
    if (this.person.get(participant.identity) === undefined) {
      this.person.set(participant.identity, this.count);
      this.another.set(this.count, participant.identity)
      this.count += 1
    }
    let element = this.r[0];
    console.log(this.r, this.person, 'persons list', participant.identity);
    participant.tracks.forEach((publication) => {
      this.listenToSubscriptionEvents(publication, element, participant)
    });
    // console.log(element,'in participant');
    this.roomObj.on('trackPublished', (publication) => {
      // console.log()
      this.listenToSubscriptionEvents(publication, element, participant)
    });
  }

  connectToRoom(accessToken: string, options): void {
    console.log('reached in connect to Room')
    connect(accessToken, options).then(room => {
      this.roomObj = room;
      // let count = 0;
      // let dom_ref = this.r
      // console.log(dom_ref,'d');
      createLocalVideoTrack().then(track => {
        this.localVideo.nativeElement.appendChild(track.attach());
      })

      // function subscribed(track,element){
      //   console.log(element,'e')
      //   element.nativeElement.appendChild(track.attach());
      //   console.log('Subscribed to RemoteTrack:', track.sid);
      // }
      // function unsubscribed(track){
      //   track.detach().forEach((element)=>{
      //     element.remove();
      //   })
      //   console.log('Unsubscribed to RemoteTrack:', track.sid);
      // }
      // function listenToSubscriptionEvents(publication,element){
      //   let e = element
      //   console.log(e,'in listen')
      //   publication.on('subscribed', (track)=>{subscribed(track,e)});
      //   publication.on('unsubscribed', unsubscribed);
      //   // publication.on('subscriptionFailed', subscriptionFailed);
      // }

      // function participantConnected(participant,p,o){
      //   // console.log(participant.identity,'PIII',p);
      //   if(p.get(participant.identity) === undefined){
      //     p.set(participant.identity,count);
      //     o.set(count,participant.identity)
      //     count += 1
      //   }
      //   let element = dom_ref[p.get(participant.identity)]
      //   participant.tracks.forEach((publication)=>{
      //     listenToSubscriptionEvents(publication,element)
      //   });
      //   // console.log(element,'in participant');
      //   room.on('trackPublished', (publication)=>{
      //     // console.log()
      //     listenToSubscriptionEvents(publication,element)
      //   });
      // }

      this.roomObj.participants.forEach((participant) => {
        this.participantConnected(participant)
      });
      this.roomObj.on('participantConnected', (participant) => {
        this.participantConnected(participant)
      })
    });
  }
}
