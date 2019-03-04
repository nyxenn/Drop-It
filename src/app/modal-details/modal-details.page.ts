import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPicturePage } from '../modal-picture/modal-picture.page';
import { SvMessageService } from '../sv-message.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
    selector: 'app-modal-details',
    templateUrl: './modal-details.page.html',
    styleUrls: ['./modal-details.page.scss']
})
export class ModalDetailsPage implements OnInit {
    // Values passed from map
    @Input() msg: string;
    @Input() picture: string;
    @Input() user: string;
    @Input() docid: string;

    public messageRated = false;
    public messageBookmarked = false;
    public messageUpvoted = false;
    public messageDownvoted = false;
    public doc = null;

    constructor(
        private modalCtrl: ModalController,
        private msgService: SvMessageService,
        private afs: AngularFirestore
    ) {}

    ngOnInit() {
        // Check if user has rated message before, check type if true
        this.messageRated = this.msgService.checkMessageRated(this.docid);
        if (this.messageRated) {
            this.checkRatingType();
        }

        // Check if user has message bookmarked
        this.messageBookmarked = this.msgService.checkMessageBookmarked(
            this.docid
        );

        // Get document from database
        this.afs
            .doc('messages/' + this.docid)
            .valueChanges()
            .subscribe(doc => {
                this.doc = doc;
            });
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    // Show picture attached to message
    async showPicture() {
        if (this.picture) {
            const modal = await this.modalCtrl.create({
                component: ModalPicturePage,
                componentProps: { picture: this.picture },
                cssClass: 'picture-modal'
            });

            await modal.present();
        }
    }

    // Handle vote event
    vote(type: string) {
        const ratedMessage = { id: this.docid, msg: this.msg, type };

        // Add +1 (+2 if already voted) to message score
        if (type === 'up' && !this.messageUpvoted) {
            this.messageUpvoted = true;
            this.messageDownvoted = false;
            this.msgService.voteMessage(this.docid, true, this.messageRated);
        }

        // Remove -1 (-2 if already voted) from message score
        if (type === 'down' && !this.messageDownvoted) {
            this.messageUpvoted = false;
            this.messageDownvoted = true;
            this.msgService.voteMessage(this.docid, false, this.messageRated);
        }

        // Add message to ratedMessages array or update the type (up/down)
        if (!this.messageRated) {
            this.messageRated = true;
            this.msgService.addRatedMessage(ratedMessage);
        } else {
            this.msgService.updateRatedMessage(ratedMessage);
        }
    }

    // Check rating type and update variables accordingly
    checkRatingType() {
        const msg = this.msgService.getRatedMessage(this.docid);
        // @ts-ignore
        msg.type === 'up'
            ? (this.messageUpvoted = true)
            : (this.messageDownvoted = true);
    }

    // (Un)bookmark a message
    bookmark() {
        const message = {
            id: this.docid,
            msg: this.msg,
            picture: this.picture,
            user: this.user
        };

        this.messageBookmarked = !this.messageBookmarked;

        this.msgService.bookmarkMessage(message, this.messageBookmarked);
    }
}
