import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ModalWritePage } from './modal-write.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule],
    declarations: [ModalWritePage],
    entryComponents: [ModalWritePage]
})
export class ModalWritePageModule {}
