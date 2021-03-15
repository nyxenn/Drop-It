import { Component, OnInit, ViewChild } from '@angular/core';
import { SvMessageService } from '../sv-message.service';
import { IonSlides, ModalController } from '@ionic/angular';
import { ModalDetailsPage } from '../modal-details/modal-details.page';

@Component({
    selector: 'app-tab-saved',
    templateUrl: './tab-saved.page.html',
    styleUrls: ['./tab-saved.page.scss']
})
export class TabSavedPage implements OnInit {
    private bookmarkedMsgs = [];
    private ownMessages = [];
    public slides = [];
    public selectedSegment = 'bookmarked';
    @ViewChild('slider') slider: IonSlides;

    constructor(
        private messageSrvc: SvMessageService,
        private modalCtrl: ModalController
    ) {}

    ngOnInit() {
        this.bookmarkedMsgs = this.messageSrvc.getBookmarkedMessages();
        this.ownMessages = this.messageSrvc.getOwnMessages();

        this.slides = [
            {
                id: 'bookmarked',
                value: 'bookmarked',
                items: this.bookmarkedMsgs
            },
            {
                id: 'written',
                value: 'written',
                items: this.ownMessages
            }
        ];
    }

    segmentChanged(event) {
        const selectedIndex = this.slides.findIndex(slide => {
            return slide.id === event.detail.value;
        });

        this.slider.slideTo(selectedIndex);
    }

    slideChanged(event) {
        this.slider
            .getActiveIndex()
            .then(i => (this.selectedSegment = this.slides[i].id));
    }

    async openDetailsModal(msg) {
        const modal = await this.modalCtrl.create({
            component: ModalDetailsPage,
            componentProps: {
                msg: msg.msg,
                picture: msg.picture,
                user: msg.user,
                docid: msg.id
            },
            cssClass: 'details-modal'
        });

        await modal.present();
    }
}
