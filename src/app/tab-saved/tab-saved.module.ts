import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabSavedPage } from './tab-saved.page';
import { PipesModule } from '../pipes/pipes';

const routes: Routes = [
    {
        path: '',
        component: TabSavedPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        PipesModule
    ],
    declarations: [TabSavedPage]
})
export class TabSavedPageModule {}
