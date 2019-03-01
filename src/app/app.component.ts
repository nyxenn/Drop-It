import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { SvDeviceService } from './sv-device.service';
import { SvMessageService } from './sv-message.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private androidPermissions: AndroidPermissions,
        private deviceService: SvDeviceService,
        private messageService: SvMessageService
    ) {
        this.initializeApp();
        this.androidPermissions
            .requestPermissions([
                this.androidPermissions.PERMISSION.READ_PHONE_STATE,
                this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
                this.androidPermissions.PERMISSION.CAMERA
            ])
            .then(() => {
                this.deviceService.getDeviceID();
                this.messageService.getBookmarkedMessages();
                this.messageService.getRatedMessages();
            });
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
