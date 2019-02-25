import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { GeoPoint } from '@firebase/firestore-types';
import { GeoFirePoint } from 'geofirex';
import { SvDeviceService } from './sv-device.service';

@Injectable({
    providedIn: 'root'
})
export class SvMessageService {
    public ownMessages = [];
    public savedMessages = [];
    public dbMessages = [];
    public locations = [];
    private geo = geofirex.init(firebaseApp);
    constructor(
        private storage: Storage,
        private afs: AngularFirestore,
        private devService: SvDeviceService
    ) {}
    // // Get markers stored in localstorage and place on map
    // getMessagesLocalStorage() {
    //     this.getOwnMessages();
    //     this.getSavedMessages();
    // }
    // getOwnMessages() {
    //     this.storage.get('own-messages').then(msgs => {
    //         this.ownMessages = JSON.parse(msgs);
    //         return this.ownMessages;
    //     });
    // }
    // getSavedMessages() {
    //     this.storage.get('saved-messages').then(msgs => {
    //         this.savedMessages = JSON.parse(msgs);
    //         return this.savedMessages;
    //     });
    // }

    storeMessage(msg: string, pos: Geoposition, img) {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const gfxPoint = this.geo.point(lat, lng).data;

        const message = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            icon: img,
            pos: gfxPoint,
            msg,
            picture: null,
            rating: 0,
            user: this.devService.getDeviceID()
        };
        this.ownMessages.push(message);
        // Create message doc in database
        const id = this.afs.createId();
        this.afs.doc('messages/' + id).set(message);
        // Place copy in local storage
        this.storage.set('own-messages', JSON.stringify(this.ownMessages));
    }

    // Get messages in 1km vicinity from db
    getMessagesNearby(lat, lng) {
        const center = this.geo.point(lat, lng);
        const radius = 1;
        const field = 'pos';

        return this.geo.collection('messages').within(center, radius, field);
    }

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
}
