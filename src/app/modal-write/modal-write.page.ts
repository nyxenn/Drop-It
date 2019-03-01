import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToastController } from '@ionic/angular';
import { ModalPicturePage } from '../modal-picture/modal-picture.page';
import {
    AngularFireStorage,
    AngularFireUploadTask
} from 'angularfire2/storage';
import { SvDeviceService } from '../sv-device.service';

@Component({
    selector: 'app-modal-write',
    templateUrl: './modal-write.page.html',
    styleUrls: ['./modal-write.page.scss']
})
export class ModalWritePage implements OnInit {
    public message: String;
    public picture;
    public pictureBlob = null;
    public pictureAdded: boolean;
    public task: AngularFireUploadTask;

    constructor(
        private modalCtrl: ModalController,
        private actionShCtrl: ActionSheetController,
        private camera: Camera,
        private toastCtrl: ToastController,
        private storage: AngularFireStorage,
        private deviceSrvc: SvDeviceService,
        private loadingCtrl: LoadingController
    ) {}

    ngOnInit() {}

    closeModal() {
        this.modalCtrl.dismiss();
    }

    // Upload image on submit, return msg and downloadURL on dismissing modal
    async submitForm() {
        if (this.pictureBlob) {
            const path = `image/${this.deviceSrvc.getDeviceID()}_${new Date().getTime()}`;
            const loading = await this.loadingCtrl.create({
                message: 'Uploading message, please wait'
            });

            this.task = this.storage.upload(path, this.pictureBlob);

            await this.task.then(data => {
                data.ref.getDownloadURL().then(downloadURL => {
                    loading.dismiss();
                    this.modalCtrl.dismiss({
                        msg: this.message,
                        picture: downloadURL
                    });
                });
            });
        } else {
            this.modalCtrl.dismiss({
                msg: this.message,
                picture: null
            });
        }
    }

    // Open action sheet to select method of adding picture
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
                this.pictureBlob = this.dataURItoBlob(imageData);
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

    // Convert base64 string to blob
    dataURItoBlob(dataURI) {
        const byteString = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'image/jpeg' });
        return blob;
    }

    // Select picture from phone gallery
    choosePicture() {
        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true
        };

        // Get picture from phone gallery
        this.camera.getPicture(options).then(
            imageData => {
                // imageData is a base64 encoded string
                const base64Image = 'data:image/jpeg;base64,' + imageData;
                this.picture = base64Image;
                this.pictureBlob = this.dataURItoBlob(imageData);
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

    // Clear selected picture
    deletePicture() {
        this.picture = null;
        this.pictureBlob = null;
        this.pictureAdded = false;
    }

    // Show uncropped picture when clicking on preview
    async showPicture() {
        const modal = await this.modalCtrl.create({
            component: ModalPicturePage,
            componentProps: { picture: this.picture },
            cssClass: 'picture-modal'
        });

        await modal.present();
    }
}
