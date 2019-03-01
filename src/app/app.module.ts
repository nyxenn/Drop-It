import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { HaversineService } from 'ng2-haversine';

import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { ModalDetailsPageModule } from './modal-details/modal-details.module';
import { ModalPicturePageModule } from './modal-picture/modal-picture.module';
import { ModalWritePageModule } from './modal-write/modal-write.module';
import { SvMapService } from './sv-map.service';
import { SvDeviceService } from './sv-device.service';
import { SvMessageService } from './sv-message.service';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireStorageModule,
        ModalDetailsPageModule,
        ModalPicturePageModule,
        ModalWritePageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        GoogleMaps,
        Geolocation,
        UniqueDeviceID,
        Firebase,
        HaversineService,
        SvMessageService,
        SvMapService,
        SvDeviceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
