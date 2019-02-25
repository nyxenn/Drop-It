import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabMapPage } from './tab-map.page';
import { ModalWritePage } from '../modal-write/modal-write.page';
import { ModalDetailsPage } from '../modal-details/modal-details.page';
import { SvMessageService } from '../sv-message.service';
import { SvMapService } from '../sv-map.service';
import { SvDeviceService } from '../sv-device.service';

const routes: Routes = [
    {
        path: '',
        component: TabMapPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [TabMapPage, ModalWritePage, ModalDetailsPage],
    entryComponents: [ModalWritePage, ModalDetailsPage],
    providers: [SvMessageService, SvMapService, SvDeviceService]
})
export class TabMapPageModule {}
