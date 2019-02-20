import { Component, ViewChild } from "@angular/core";
import { Platform, NavController } from "@ionic/angular";
import {
    GoogleMaps,
    GoogleMap,
    GoogleMapsEvent,
    LatLng,
    MarkerOptions,
    Marker
} from "@ionic-native/google-maps";
import { Observable } from "rxjs";

@Component({
    selector: "app-tab2",
    templateUrl: "tab2.page.html",
    styleUrls: ["tab2.page.scss"]
})
export class Tab2Page {
    @ViewChild("map") element;

    constructor(
        public googleMaps: GoogleMaps,
        public plt: Platform,
        public nav: NavController
    ) {}

    async ngOnInit() {
        // Since ngOnInit() is executed before `deviceready` event,
        // you have to wait the event.

        await this.loadMap();
    }

    loadMap() {
        let map: GoogleMap = GoogleMaps.create("map", {
            camera: {
                target: {
                    lat: 43.0741704,
                    lng: -89.3809802
                },
                zoom: 18,
                tilt: 30
            }
        });
    }
}
