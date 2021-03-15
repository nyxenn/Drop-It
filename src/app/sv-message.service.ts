import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription, Observable } from 'rxjs';
import { GeoPoint } from '@firebase/firestore-types';
import { GeoFirePoint } from 'geofirex';
import { SvDeviceService } from './sv-device.service';

@Injectable({
    providedIn: 'root'
})
export class SvMessageService {
    public ownMessages: any[] = [];
    public bookmarkedMessages: any[] = [];
    public ratedMessages: any[] = [];
    public dbMessages: any[] = [];
    public locations: any[] = [];
    private geo = geofirex.init(firebaseApp);
    constructor(
        private storage: Storage,
        private afs: AngularFirestore,
        private devService: SvDeviceService
    ) {}

    // Get own messages from local storage
    getOwnMessages() {
        if (!this.ownMessages || !this.ownMessages.length) {
            this.storage.get('own-messages').then(msgs => {
                this.ownMessages = JSON.parse(msgs);
                return msgs;
            });
        } else {
            return this.ownMessages;
        }
    }

    // Get array of rated messages
    getRatedMessages() {
        this.storage.get('rated-messages').then(msgs => {
            this.ratedMessages = JSON.parse(msgs);
            return this.ratedMessages;
        });
    }

    // Get message from ratedMessages array
    getRatedMessage(msgId) {
        let message;

        if (!this.ratedMessages || !this.ratedMessages.length) {
            this.getRatedMessages();
        } else {
            for (let i = 0; i < this.ratedMessages.length; i++) {
                if (this.ratedMessages[i].id === msgId) {
                    message = this.ratedMessages[i];
                    break;
                }
            }
        }

        return message;
    }

    // Add a message to ratedMessages array, store in local storage
    addRatedMessage(msg) {
        if (!this.ratedMessages || !this.ratedMessages.length) {
            this.getRatedMessages();
        }

        let msgs = this.ratedMessages || [];
        msgs.push(msg);
        this.ratedMessages = msgs;
        this.storage.set('rated-messages', JSON.stringify(this.ratedMessages));
    }

    // Check if a message is in the ratedMessages array
    checkMessageRated(msgId: string): boolean {
        let found = false;

        if (!this.ratedMessages || !this.ratedMessages.length) {
            this.getRatedMessages();
        } else {
            for (let i = 0; i < this.ratedMessages.length; i++) {
                if (this.ratedMessages[i].id === msgId) {
                    found = true;
                    break;
                }
            }

            return found;
        }
    }

    // Update message type in array, store in local storage
    updateRatedMessage(msg) {
        for (let i = 0; i < this.ratedMessages.length; i++) {
            if (this.ratedMessages[i].id === msg.id) {
                this.ratedMessages[i].type = msg.type;
                break;
            }
        }

        this.storage.set('rated-messages', JSON.stringify(this.ratedMessages));
    }

    // Get bookmarked messages from local storage
    getBookmarkedMessages() {
        if (!this.bookmarkedMessages || !this.bookmarkedMessages.length) {
            this.storage.get('bookmarked-messages').then(msgs => {
                this.bookmarkedMessages = JSON.parse(msgs);
                return msgs;
            });
        } else {
            return this.bookmarkedMessages;
        }
    }

    // Add or remove msg from bookmarkedMessages array
    bookmarkMessage(msg, bookmarked) {
        if (!this.bookmarkedMessages || !this.bookmarkedMessages.length) {
            this.getBookmarkedMessages();
        }

        if (bookmarked) {
            this.bookmarkedMessages.push(msg);
        } else {
            for (let i = 0; i < this.bookmarkedMessages.length; i++) {
                if (this.bookmarkedMessages[i].id === msg.id) {
                    this.bookmarkedMessages.splice(i, 1);
                    break;
                }
            }
        }

        this.storage.set(
            'bookmarked-messages',
            JSON.stringify(this.bookmarkedMessages)
        );
    }

    // Check if a message is in the bookmarkedMessages array
    checkMessageBookmarked(msgId: string): boolean {
        let found = false;

        if (!this.bookmarkedMessages || !this.bookmarkedMessages.length) {
            this.getBookmarkedMessages();
        } else {
            for (let i = 0; i < this.bookmarkedMessages.length; i++) {
                if (this.bookmarkedMessages[i].id === msgId) {
                    found = true;
                    break;
                }
            }

            return found;
        }
    }

    // Store new message in database and local storage
    storeMessage(docid: string, msg: string, pos: Geoposition, img, picture) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const gfxPoint = this.geo.point(lat, lng).data;
        const user = this.devService.getDeviceID();

        const message = {
            docid,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            icon: img,
            pos: gfxPoint,
            msg,
            picture,
            rating: 0,
            user
        };

        // Create message doc in database
        this.afs.doc('messages/' + docid).set(message);

        // Place copy in local storage
        let msgs = this.ownMessages || [];
        msgs.push({ id: docid, msg, picture, user });
        this.ownMessages = msgs;
        this.storage.set('own-messages', JSON.stringify(this.ownMessages));
    }

    // Get messages in 1km vicinity from db
    getMessagesNearby(lat, lng) {
        const center = this.geo.point(lat, lng);
        const radius = 1;
        const field = 'pos';

        return this.geo.collection('messages').within(center, radius, field);
    }

    // Check if a marker exists at given lat & lng
    isLocationFree(lat, lng): boolean {
        for (let i = 0, l = this.locations.length; i < l; i++) {
            if (
                this.locations[i].lat === lat &&
                this.locations[i].lng === lng
            ) {
                return false;
            }
        }
        this.locations.push({ lat, lng });
        return true;
    }

    // Add or remove a vote from rating
    voteMessage(docId, up: boolean, rated: boolean, user: string) {
        const n = rated ? 2 : 1;

        this.afs
            .doc(`messages/${docId}`)
            .get()
            .subscribe(doc => {
                this.afs.doc(`messages/${docId}`).update({
                    rating: up ? doc.data().rating + n : doc.data().rating - n
                });
            });

        this.afs
            .doc(`users/${user}`)
            .get()
            .subscribe(doc => {
                this.afs.doc(`users/${user}`).update({
                    score: up ? doc.data().score + n : doc.data().score - n
                });
            });
    }

    // Return message's score
    getScore(docId): Observable<any> {
        return this.afs.doc(`messages/${docId}`).valueChanges();
    }

    // Return user's total score
    getTotalScoreUser(userId) {
        return this.afs.doc(`users/${userId}`).valueChanges();
    }
}
