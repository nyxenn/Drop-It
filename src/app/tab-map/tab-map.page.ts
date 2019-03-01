import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { GoogleMaps, GoogleMap, LatLng } from '@ionic-native/google-maps';
import { mapOptions } from '../mapStyle';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
import { ModalWritePage } from '../modal-write/modal-write.page';
import { Storage } from '@ionic/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { SvDeviceService } from '../sv-device.service';
import { SvMessageService } from '../sv-message.service';
import { SvMapService } from '../sv-map.service';

@Component({
    selector: 'app-tab-map',
    templateUrl: './tab-map.page.html',
    styleUrls: ['./tab-map.page.scss']
})
export class TabMapPage implements OnInit {
    private map: GoogleMap;
    private dbMessages;
    private uuid: string;

    @ViewChild('map') mapEle;

    constructor(
        public googleMaps: GoogleMaps,
        public plt: Platform,
        public nav: NavController,
        private modalCtrl: ModalController,
        private geoloc: Geolocation,
        private storage: Storage,
        private deviceService: SvDeviceService,
        private msgService: SvMessageService,
        private mapService: SvMapService,
        private afs: AngularFirestore
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
            const message: string = data.data.msg;
            const picture: string = data.data.picture;

            // If modal form submitted, add marker to map and message to database
            if (message) {
                if (this.msgService.isLocationFree(lat, lng)) {
                    const id = this.afs.createId();
                    const newMessage = await this.mapService.createMarkerOptions(
                        message,
                        position,
                        id,
                        picture
                    );

                    this.mapService.createMarker(newMessage);
                    this.msgService.storeMessage(
                        id,
                        message,
                        position,
                        newMessage.icon,
                        picture
                    );
                }
            }
        });

        // Show modal
        await modal.present();
    }

    // Watch user's current location
    watchLocation() {
        const watch = this.geoloc.watchPosition();

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
