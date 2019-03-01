import { Injectable } from '@angular/core';
import {
    GoogleMaps,
    GoogleMap,
    Circle,
    MyLocation,
    LatLng,
    MarkerOptions,
    Marker,
    GoogleMapsEvent
} from '@ionic-native/google-maps';
import { LoadingController, ModalController } from '@ionic/angular';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { SvDeviceService } from './sv-device.service';
import { ModalDetailsPage } from './modal-details/modal-details.page';
import { GeoCoord, HaversineService } from 'ng2-haversine';

@Injectable({
    providedIn: 'root'
})
export class SvMapService {
    public map: GoogleMap;
    private radiusCircle: Circle;
    private loading: HTMLIonLoadingElement;
    private markers = [];
    private image = {
        url: '',
        size: {
            width: 40,
            height: 40
        }
    };

    constructor(
        private loadingCtrl: LoadingController,
        private devService: SvDeviceService,
        private modalCtrl: ModalController,
        private haversine: HaversineService
    ) {}

    setMap(map: GoogleMap) {
        this.map = map;
    }

    // Get user location, center map on user and draw discovery radius
    async prepareMap() {
        // Show loading indicator
        this.loading = await this.loadingCtrl.create({
            message: 'Loading map...'
        });
        await this.loading.present();

        this.map
            .getMyLocation()
            .then((loc: MyLocation) => {
                this.loading.dismiss();
                this.centerOnUser(loc.latLng);
                this.drawRadiusCircle(loc.latLng);
            })
            .then(() => {
                return;
            });
    }

    // Move camera to current location
    centerOnUser(latLng: LatLng) {
        this.map.animateCamera({
            target: latLng,
            zoom: 18,
            tilt: 40
        });
    }

    // Draw discovery radius around current location
    drawRadiusCircle(latLng: LatLng) {
        this.map
            .addCircle({
                center: latLng,
                radius: 120,
                strokeColor: 'rgba(43, 41, 43, 0.6)',
                strokeWidth: 3,
                fillColor: 'rgba(0, 0, 0, 0)'
            })
            .then(circle => {
                this.radiusCircle = circle;
            });
    }

    // Update discovery circle center
    updateRadiusCircle(latLng: LatLng) {
        if (this.radiusCircle) {
            this.radiusCircle.setCenter(latLng);
        }
    }

    // Add marker to map
    createMarker(
        opts: MarkerOptions = null,
        msg: string = null,
        pos: Geoposition = null,
        docid?: string
    ) {
        // If existing: convert lat & long coords into LatLng
        if (opts) {
            opts.position = new LatLng(opts.lat, opts.lng);
        }

        opts = !opts ? this.createMarkerOptions(msg, pos, docid) : opts; // Generate MarkerOptions if not given
        opts.visible = false;

        // Add marker to map with click event listener
        this.addMarkerToMap(opts);
    }

    // Generate marker options from coordinates and string
    createMarkerOptions(
        msg: string,
        pos: Geoposition,
        docid: string,
        picture?: string
    ): MarkerOptions {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.image.url =
            Math.random() > 0.5
                ? './assets/img/msg.png'
                : './assets/img/msg_i.png';

        const opts: MarkerOptions = {
            docid,
            position: new LatLng(lat, lng),
            icon: this.image,
            msg,
            lat,
            lng,
            picture,
            rating: 0,
            user: this.devService.getDeviceID()
        };

        return opts;
    }

    // Add the marker with given options to map instance
    addMarkerToMap(opts: MarkerOptions) {
        let m: Marker;

        this.map.addMarker(opts).then((marker: Marker) => {
            // Add click event to marker that opens details modal
            marker
                .addEventListener(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(async res => {
                    const mrkr = res[1];

                    const modal = await this.modalCtrl.create({
                        component: ModalDetailsPage,
                        componentProps: {
                            msg: mrkr.get('msg'),
                            picture: mrkr.get('picture'),
                            user: mrkr.get('user'),
                            docid: mrkr.get('docid')
                        },
                        cssClass: 'details-modal'
                    });

                    await modal.present();
                });

            m = marker;
            this.markers.push(m);
        });
    }

    // Show nearby messages, hide others
    showMarkers() {
        let coords: GeoCoord;

        if (this.markers.length > 0) {
            this.markers.forEach((mrkr: Marker) => {
                coords = {
                    latitude: mrkr.get('lat'),
                    longitude: mrkr.get('lng')
                };

                if (
                    this.haversine.getDistanceInMeters(
                        this.devService.getUserLocation(),
                        coords
                    ) <= 120
                ) {
                    mrkr.setVisible(true);
                } else {
                    mrkr.setVisible(false);
                }
            });
        }
    }
}
