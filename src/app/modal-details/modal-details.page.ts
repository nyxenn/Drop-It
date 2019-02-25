import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-modal-details',
    templateUrl: './modal-details.page.html',
    styleUrls: ['./modal-details.page.scss']
})
export class ModalDetailsPage implements OnInit {
    // Values passed from map
    @Input() msg: string;
    @Input() picture: string;
    @Input() rating: number;
    @Input() user: string;

    constructor(private view: ModalController) {}

    ngOnInit() {}

    closeModal() {
        this.view.dismiss();
    }
}
