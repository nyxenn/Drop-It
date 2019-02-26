import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-modal-write',
    templateUrl: './modal-write.page.html',
    styleUrls: ['./modal-write.page.scss']
})
export class ModalWritePage implements OnInit {
    private message: String;
    private picture;
    private pictureAdded: boolean;

    constructor(
        private modal: ModalController,
        private actionShCtrl: ActionSheetController,
        private camera: Camera,
        private toastCtrl: ToastController
    ) {}

    ngOnInit() {}

    closeModal() {
        this.modal.dismiss();
    }

    submitForm() {
        this.modal.dismiss(this.message);
    }

    async addPicture() {
        const actionSheet = await this.actionShCtrl.create({
            header: 'Add picture',
            buttons: [
                {
                    text: 'Take picture',
                    icon: 'camera',
                    handler: () => this.takePicture()
                },
                {
                    text: 'Choose from gallery',
                    icon: 'photos',
                    handler: () => this.choosePicture()
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close-circle'
                }
            ]
        });

        await actionSheet.present();
    }

    // Open camera and return base64 encoded string to represent image
    takePicture() {
        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA,
            correctOrientation: true
        };

        this.camera.getPicture(options).then(
            imageData => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                const base64Image = 'data:image/jpeg;base64,' + imageData;
                this.picture = base64Image;
                this.pictureAdded = true;
            },
            async err => {
                // Handle error
                const toast = await this.toastCtrl.create({
                    message:
                        'Something went wrong while adding your image, please try again later',
                    duration: 2000
                });
                await toast.present();
                console.log(err);
            }
        );
    }

    // Select picture from phone gallery
    choosePicture() {
        this.pictureAdded = true;
    }

    // Clear selected picture
    deletePicture() {
        this.picture = null;
        this.pictureAdded = false;
    }

    // Show uncropped picture when clicking on preview
    showPicture() {}
}
