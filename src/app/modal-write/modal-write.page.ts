import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@Component({
    selector: 'app-modal-write',
    templateUrl: './modal-write.page.html',
    styleUrls: ['./modal-write.page.scss']
})
export class ModalWritePage implements OnInit {
    private message: String;
    constructor(private view: ModalController, private udid: UniqueDeviceID) {}
    private uid;

    ngOnInit() {
        // Get unique device ID
        this.udid
            .get()
            .then((uuid: any) => (this.uid = uuid))
            .catch((error: any) => console.log('UID error:', error));
    }

    closeModal() {
        this.view.dismiss();
    }

    submitForm() {
        this.view.dismiss(this.message);
    }
}
