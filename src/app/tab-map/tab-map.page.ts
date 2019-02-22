import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    LatLng,
    MarkerOptions,
    Marker,
    MyLocation
} from '@ionic-native/google-maps';
import { Observable } from 'rxjs';
import { mapOptions } from './mapStyle';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalWritePage } from '../modal-write/modal-write.page';

@Component({
    selector: 'app-tab-map',
    templateUrl: './tab-map.page.html',
    styleUrls: ['./tab-map.page.scss']
})
export class TabMapPage implements OnInit {
    private loading: HTMLIonLoadingElement;
    private map: GoogleMap;
    private image = {
        url:
            Math.random() > 0.5
                ? './assets/img/msg.png'
                : './assets/img/msg_i.png',
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
        private geoloc: Geolocation
    ) {}

    async ngOnInit() {
        // Since ngOnInit() is executed before `deviceready` event,
        // you have to wait the event.
        await this.plt.ready();
        await this.loadMap();
    }

    async loadMap() {
        this.map = GoogleMaps.create('map', mapOptions); // Create new map instance

        // Show loading indicator
        this.loading = await this.loadingCtrl.create({
            message: 'Loading map...'
        });
        await this.loading.present();

        // Get location after creating map, otherwise map == blank on first visit
        this.map.getMyLocation().then((location: MyLocation) => {
            this.loading.dismiss(); // Dismiss loading indicator when location received

            // Move camera to current location
            this.map.animateCamera({
                target: location.latLng,
                zoom: 17,
                tilt: 30
            });
        });
    }

    async writeButtonClick() {
        const currentPos: Geoposition = await this.geoloc.getCurrentPosition();
        await this.presentModal(currentPos);
    }

    async presentModal(position: Geoposition) {
        let message: string = null;

        const modal = await this.modalCtrl.create({
            component: ModalWritePage
        });

        modal.onDidDismiss().then(data => {
            message = data.data;
            this.makeMarker(message, position);
        });
        await modal.present();
    }

    makeMarker(message: string, pos: Geoposition) {
        let markerOptions: MarkerOptions = {
            position: new LatLng(pos.coords.latitude, pos.coords.longitude),
            icon: this.image,
            snippet: message
        };

        this.map.addMarker(markerOptions).then((marker: Marker) => {
            marker
                .addEventListener(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(res => console.log(res));
        });
    }
}
