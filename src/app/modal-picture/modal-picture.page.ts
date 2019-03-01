import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-modal-picture',
    templateUrl: './modal-picture.page.html',
    styleUrls: ['./modal-picture.page.scss']
})
export class ModalPicturePage implements OnInit {
    @Input() picture;

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    closeModal() {
        this.modal.dismiss();
    }
}
