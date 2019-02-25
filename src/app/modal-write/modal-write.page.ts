import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-modal-write',
    templateUrl: './modal-write.page.html',
    styleUrls: ['./modal-write.page.scss']
})
export class ModalWritePage implements OnInit {
    private message: String;

    constructor(private view: ModalController) {}

    ngOnInit() {}

    closeModal() {
        this.view.dismiss();
    }

    submitForm() {
        this.view.dismiss(this.message);
    }
}
