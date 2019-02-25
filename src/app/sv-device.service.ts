import { Injectable } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { GeoCoord } from 'ng2-haversine';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
    providedIn: 'root'
})
export class SvDeviceService {
    public uuid: string;
    public userLocation: GeoCoord = null;
    constructor(private udid: UniqueDeviceID, private geoloc: Geolocation) {}

    // Get device ID (used for user profiles)
    getDeviceID() {
        // Get uuid if hasn't been retrieved yet otherwise return this.uuid
        if (!this.uuid) {
            this.udid.get().then(uuid => {
                this.uuid = uuid;
                return uuid;
            });
        } else {
            return this.uuid;
        }
    }

    setUserLocation(userLocation: GeoCoord) {
        this.userLocation = userLocation;
    }

    getUserLocation() {
        return this.userLocation;
    }
    // getProfileInfo() {}
}
