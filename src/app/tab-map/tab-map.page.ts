import { Component, OnInit, ViewChild } from '@angular/core';
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
import { mapOptions } from '../mapStyle';
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
import { ModalDetailsPage } from '../modal-details/modal-details.page';
import * as firebaseApp from 'firebase/app';
import * as geofirex from 'geofirex';
import { Observable } from 'rxjs';
import { HaversineService, GeoCoord } from 'ng2-haversine';
import { SvDeviceService } from '../sv-device.service';
import { SvMessageService } from '../sv-message.service';
import { SvMapService } from '../sv-map.service';

@Component({
    selector: 'app-tab-map',
    templateUrl: './tab-map.page.html',
    styleUrls: ['./tab-map.page.scss']
})
export class TabMapPage implements OnInit {
    private geo = geofirex.init(firebaseApp);
    private radiusCircle: Circle;
    private loading: HTMLIonLoadingElement;
    private map: GoogleMap;
    private ownMessages = [];
    private dbMessages;
    private userLocation: GeoCoord = null;
    private uuid;
    private locations = [];
    private markers = [];
    // private image = {
    //     url: '',
    //     size: {
    //         width: 40,
    //         height: 40
    //     }
    // };

    @ViewChild('map') mapEle;

    constructor(
        public googleMaps: GoogleMaps,
        public plt: Platform,
        public nav: NavController,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        private geoloc: Geolocation,
        private storage: Storage,
        private udid: UniqueDeviceID,
        private afs: AngularFirestore,
        private haversine: HaversineService,
        private deviceService: SvDeviceService,
        private msgService: SvMessageService,
        private mapService: SvMapService
    ) {}

    async ngOnInit() {
        // Since ngOnInit() is executed before `deviceready` event,
        // you have to wait the event.
        await this.plt.ready();
        await this.storage.ready();
        await this.loadMap();
        this.uuid = this.deviceService.getDeviceID();
    }

    // Show map
    loadMap() {
        this.map = GoogleMaps.create('map', mapOptions); // Create new map instance
        this.mapService.setMap(this.map);

        this.mapService.prepareMap();
        this.watchLocation();

        setInterval(() => this.mapService.showMarkers(), 3000); // Show only nearby markers
    }

    // Write message handler
    async writeButtonClick() {
        const currentPos: Geoposition = await this.geoloc.getCurrentPosition();
        await this.presentModal(currentPos);
    }

    // Show write message modal
    async presentModal(position: Geoposition) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const modal = await this.modalCtrl.create({
            component: ModalWritePage,
            componentProps: position
        });

        // On closing modal, add marker to map
        modal.onDidDismiss().then(async data => {
            const message: string = data.data;
            if (message) {
                if (this.msgService.isLocationFree(lat, lng)) {
                    const newMessage = await this.mapService.createMarkerOptions(
                        message,
                        position
                    );

                    this.mapService.createMarker(newMessage);
                    this.msgService.storeMessage(
                        message,
                        position,
                        newMessage.icon
                    );
                }
            }
        });

        // Show modal
        await modal.present();
    }

    // Watch user's current location
    watchLocation() {
        let watch = this.geoloc.watchPosition();

        watch.subscribe(loc => {
            const lat = loc.coords.latitude;
            const lng = loc.coords.longitude;

            const userLocation = {
                latitude: lat,
                longitude: lng
            };
            this.deviceService.setUserLocation(userLocation);
            this.mapService.updateRadiusCircle(new LatLng(lat, lng));
            this.msgService.getMessagesNearby(lat, lng).subscribe(msgs => {
                if (msgs) {
                    this.dbMessages = msgs;
                    this.dbMessages.forEach(msg => {
                        if (this.msgService.isLocationFree(msg.lat, msg.lng)) {
                            this.mapService.createMarker(msg);
                        }
                    });
                }
            });
        });
    }
}
