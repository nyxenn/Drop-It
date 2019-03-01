import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPicturePage } from './modal-picture.page';

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule],
    declarations: [ModalPicturePage],
    entryComponents: [ModalPicturePage]
})
export class ModalPicturePageModule {}
