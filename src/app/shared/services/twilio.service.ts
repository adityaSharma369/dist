import {ElementRef, Injectable} from '@angular/core';
import {connect, createLocalVideoTrack} from 'twilio-video';


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
    }

    dynamic_users = {};

    // track_identities = {};

    subscribed(track, element, participant) {
        let elem;
        let user_uid = participant.identity;
        console.log(element, 'e', participant)
        if (this.dynamic_users[user_uid] == undefined) {
            elem = document.createElement('div');
            elem.setAttribute('class', 'remote-video-item fade-in');
            elem.setAttribute('data', Math.random());
            elem.setAttribute('id', 'remote-video-' + user_uid);
            this.dynamic_users[user_uid] = elem
        } else {
            elem = this.dynamic_users[user_uid];
        }
        if (track) {
            elem.append(track.attach());
        }
        element.nativeElement.appendChild(elem);
        // console.log('Subscribed to RemoteTrack:', track.sid);
    }

    unsubscribed(participant, track) {
        let user_uid = participant.identity;
        const elem = document.getElementById('remote-video-' + user_uid);

        elem.setAttribute("class", "remote-video-item fade-out");

        setTimeout(() => {
            if (elem) {
                elem.setAttribute("class", "remote-video-item fade-in");
                elem.remove();
            }

            if (track) {
                track.detach().forEach((element) => {
                    element.remove();
                })
            }

        }, 500);


// todo RIGHT LOGIC
        // if (elem && elem.children.length <= 1) {
        //     elem.setAttribute("class", "remote-video-item fade-out");
        //     setTimeout(() => {
        //         elem.setAttribute("class", "remote-video-item fade-in");
        //         elem.remove();
        //     }, 500);
        // }

        console.log('Unsubscribed to RemoteTrack:', track.sid);
    }

    listenToSubscriptionEvents(publication, element, participant) {
        let e = element
        console.log("inside listenToSubscriptionEvents()")
        publication.on('subscribed', (track) => {
            console.log("subscribed to new stream", track);
            this.subscribed(track, e, participant)
        });
        publication.on('unsubscribed', this.unsubscribed.bind(null, participant));
        // publication.on('subscriptionFailed', subscriptionFailed);
    }

    subscribed_participants = [];

    participantConnected(participant) {
        console.log(participant.identity, 'PIII');
        if (this.person.get(participant.identity) === undefined) {
            this.person.set(participant.identity, this.count);
            this.another.set(this.count, participant.identity)
            this.count += 1
        }
        let element = this.r[0];
        participant.tracks.forEach((publication) => {
            // console.log("publicationsubscribeevent",publication.track)
            this.subscribed(publication.track, element, participant);
            // this.subscribed(track, e, participant)
            // this.listenToSubscriptionEvents(publication, element, participant)
        });
        // console.log(element,'in participant');
        this.roomObj.on('trackPublished', (publication) => {
            // console.log()
            this.listenToSubscriptionEvents(publication, element, participant)
        });
    }

    unsubscribe(retainer_ids) {
        this.subscribed_participants.forEach((participant, i) => {
            if (retainer_ids.indexOf(participant.identity) === -1) {
                participant.tracks.forEach((publication) => {
                    this.unsubscribed(participant, publication.track);
                    this.subscribed_participants.splice(i, 1);
                });
            }
        });
        // this.subscribed_participants = [];
    }


    connectToUsers(participant_ids) {
        this.unsubscribe(participant_ids);
        console.log("@#$@#$@#$@#$ length -----> ", this.subscribed_participants.length)
        // this.unsubscribed.bind(null, participant)
        if (this.roomObj && this.roomObj.participants) {
            console.log(this.roomObj.particpants);
            this.roomObj.participants.forEach((participant) => {
                // console.log(participant.identity,"participant")
                if (participant_ids.indexOf(participant.identity) > -1) {
                    const found = this.subscribed_participants.find((p) => p.identity === participant.identity);
                    if (!found) {
                        this.subscribed_participants.push(participant);
                        this.participantConnected(participant);
                    } else {
                        console.log("already video found");
                    }
                }
            });
        }
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
            //
            this.roomObj.on('participantConnected', (participant) => {
                // if (this.roomObj.participants) {
                //     console.log(this.roomObj.participants,"participants")
                //     this.roomObj.participants.push(participant);
                // } else {
                //     this.roomObj.participants = [];
                // }
                this.participantConnected(participant)
            });

        });
    }
}
