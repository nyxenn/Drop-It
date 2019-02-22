import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabMapPage } from './tab-map.page';
import { ModalWritePage } from '../modal-write/modal-write.page';

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
    declarations: [TabMapPage, ModalWritePage],
    entryComponents: [ModalWritePage]
})
export class TabMapPageModule {}
