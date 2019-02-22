import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    LatLng,
    MarkerOptions,
    Marker,
    MyLocation,
    CircleOptions,
    Circle
} from '@ionic-native/google-maps';
import { mapOptions } from './mapStyle';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalWritePage } from '../modal-write/modal-write.page';
import { Storage } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import {
    AngularFirestore,
    AngularFirestoreCollection
} from 'angularfire2/firestore';

@Component({
    selector: 'app-tab-map',
    templateUrl: './tab-map.page.html',
    styleUrls: ['./tab-map.page.scss']
})
export class TabMapPage implements OnInit {
    private loading: HTMLIonLoadingElement;
    private map: GoogleMap;
    private messages = [];
    private uuid;
    private image = {
        url: '',
        size: {
            width: 40,
            height: 40
        }
    };

    constructor(
        public googleMaps: GoogleMaps,
        public plt: Platform,
        public nav: NavController,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        private geoloc: Geolocation,
        private storage: Storage,
        private udid: UniqueDeviceID,
        private afs: AngularFirestore
    ) {}

    async ngOnInit() {
        // Since ngOnInit() is executed before `deviceready` event,
        // you have to wait the event.
        await this.plt.ready();
        await this.storage.ready();
        await this.loadMap();
        this.udid.get().then(uuid => (this.uuid = uuid));
    }

    // Show map
    async loadMap() {
        this.map = GoogleMaps.create('map', mapOptions); // Create new map instance
        let loc;

        // Show loading indicator
        this.loading = await this.loadingCtrl.create({
            message: 'Loading map...'
        });
        await this.loading.present();

        // Get location after creating map, otherwise map == blank on first visit
        this.map.getMyLocation().then((location: MyLocation) => {
            this.loading.dismiss(); // Dismiss loading indicator when location received
            loc = location.latLng;

            // Move camera to current location
            this.map.animateCamera({
                target: location.latLng,
                zoom: 22,
                tilt: 40
            });
        });

        this.drawRadius(loc); // Draw radius around user location
        this.getMessages(); // Show markers from local storage
    }

    // Draw discovery radius around user location
    drawRadius(loc: LatLng) {
        this.map
            .addCircle({
                center: loc,
                radius: 150,
                strokeColor: 'rgba(43, 41, 43, 0.6)',
                strokeWidth: 3,
                fillColor: 'rgba(0, 0, 0, 0)'
            })
            .then(circle => {
                let watch = this.geoloc.watchPosition();

                watch.subscribe(loc => {
                    // data can be a set of coordinates, or an error (if an error occurred).
                    circle.setCenter(
                        new LatLng(loc.coords.latitude, loc.coords.longitude)
                    );
                });
            });
    }

    // Write message handler
    async writeButtonClick() {
        const currentPos: Geoposition = await this.geoloc.getCurrentPosition();
        await this.presentModal(currentPos);
    }

    // Show write message modal
    async presentModal(position: Geoposition) {
        // Create modal from modal-write page
        const modal = await this.modalCtrl.create({
            component: ModalWritePage
        });

        // On closing modal, add marker to map
        modal.onDidDismiss().then(data => {
            const message: string = data.data;
            if (message) {
                this.addMarker(null, message, position);
            }
        });

        // Show modal
        await modal.present();
    }

    // Store marker in localstorage
    storeMessage(msg: string, pos: Geoposition) {
        const message = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            icon: this.image,
            msg,
            picture: null,
            rating: 0,
            user: this.uuid
        };
        this.messages.push(message);

        // Create message doc in database
        const id = this.afs.createId();
        this.afs.doc('messages/' + id).set(message);

        // Place copy in local storage
        this.storage.set('messages', JSON.stringify(this.messages));
    }

    // Get markers stored in localstorage and place on map
    getMessages() {
        let messages = [];

        this.storage
            .get('messages')
            .then(msgs => (messages = JSON.parse(msgs)))
            .then(() => {
                if (messages) {
                    messages.forEach(marker => {
                        this.addMarker(marker);
                    });
                }
            });
    }

    // ## TODO: FIX CLICK LISTENER ## Add marker to map
    addMarker(
        opts: MarkerOptions = null,
        msg: string = null,
        pos: Geoposition = null
    ) {
        const newMarker: boolean = opts ? false : true;

        // If existing: convert lat & long coords into LatLng
        if (opts) {
            opts.position = new LatLng(opts.lat, opts.lng);
        }

        opts = !opts ? this.createOptions(msg, pos) : opts; // Generate MarkerOptions if not given

        // Add marker to map with click event listener
        this.map.addMarker(opts).then((marker: Marker) => {
            marker
                .addEventListener(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(res => {
                    console.log(res[1]);
                });

            if (newMarker) {
                this.storeMessage(msg, pos); // Store new marker in local storage
            }
        });
    }

    // Generate marker options from coordinates and string
    createOptions(msg: string, pos: Geoposition): MarkerOptions {
        this.image.url =
            Math.random() > 0.5
                ? './assets/img/msg.png'
                : './assets/img/msg_i.png';

        const opts: MarkerOptions = {
            position: new LatLng(pos.coords.latitude, pos.coords.longitude),
            icon: this.image,
            msg,
            picture: null,
            rating: 0,
            user: this.uuid
        };
        return opts;
    }
}
