import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SvDeviceService } from '../sv-device.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { SvMessageService } from '../sv-message.service';
import {
    ModalController,
    ActionSheetController,
    ToastController,
    Platform,
    LoadingController
} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ModalPicturePage } from '../modal-picture/modal-picture.page';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import {
    AngularFireUploadTask,
    AngularFireStorage
} from 'angularfire2/storage';

@Component({
    selector: 'app-tab-profile',
    templateUrl: './tab-profile.page.html',
    styleUrls: ['./tab-profile.page.scss']
})
export class TabProfilePage implements OnInit {
    public user = {
        name: 'Anonymous user',
        age: 'Not set',
        location: 'Not set',
        bio: 'Not set',
        picture: null,
        score: 0
    };
    public editing = {
        name: false,
        age: false,
        location: false,
        bio: false
    };
    public score: number = 0;
    public id: string;
    public uuid: string;
    public picture;
    public pictureBlob: Blob;
    public pictureAdded: boolean;
    public previousPicture: string;
    public ownProfile: boolean;
    public task: AngularFireUploadTask;

    constructor(
        private modalCtrl: ModalController,
        private actionShCtrl: ActionSheetController,
        private camera: Camera,
        private toastCtrl: ToastController,
        private route: ActivatedRoute,
        private devService: SvDeviceService,
        private afs: AngularFirestore,
        private msgService: SvMessageService,
        private platform: Platform,
        private keyboard: Keyboard,
        private loadingCtrl: LoadingController,
        private storage: AngularFireStorage
    ) {
        // this.platform.ready().then(() => {
        //     this.keyboard.onKeyboardShow().subscribe(() => {
        //         this.showFooter = false;
        //     });
        //     this.keyboard.onKeyboardHide().subscribe(() => {
        //         this.showFooter = true;
        //     });
        // });
    }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.uuid = this.devService.getDeviceID();

        let userId;
        if (!this.id) {
            userId = this.uuid;
            this.ownProfile = true;
        } else {
            userId = this.id;
            this.ownProfile = userId === this.uuid ? true : false;
        }

        this.checkDocExists(userId);
        this.getUserScore(userId);
    }

    // Check if user's doc exists in database
    checkDocExists(id) {
        const docRef = this.afs.collection('users').doc(id).ref;

        const getDoc = docRef
            .get()
            .then(doc => {
                if (!doc.exists) {
                    this.createUser(id);
                } else {
                    // @ts-ignore
                    this.user = doc.data();
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    }

    // Create new user document
    createUser(id) {
        this.user.score = this.score;
        this.afs.doc(`users/${id}`).set(this.user);
    }

    // Get user's total message score
    getUserScore(id) {
        this.msgService.getTotalScoreUser(id).subscribe(doc => {
            // @ts-ignore
            this.score = doc.score;
        });
    }

    // Show input fields when double tapping
    editInfo(field: string) {
        if (this.ownProfile) {
            switch (field) {
                case 'name':
                    this.editing.name = true;
                    break;
                case 'age':
                    this.editing.age = true;
                    break;
                case 'location':
                    this.editing.location = true;
                    break;
                case 'bio':
                    this.editing.bio = true;
                    break;
            }
        }
    }

    // Update user info in database
    doneEditing(field: string) {
        switch (field) {
            case 'name':
                this.editing.name = false;
                break;
            case 'age':
                this.editing.age = false;
                break;
            case 'location':
                this.editing.location = false;
                break;
            case 'bio':
                this.editing.bio = false;
                break;
        }

        this.afs.doc(`users/${this.uuid}`).set(this.user);
    }

    // Open action sheet to select method of adding picture
    async changePicture() {
        const actionSheet = await this.actionShCtrl.create({
            header: 'Add picture',
            buttons: [
                {
                    text: 'Take picture',
                    icon: 'camera',
                    handler: () => this.addPicture('camera')
                },
                {
                    text: 'Choose from gallery',
                    icon: 'photos',
                    handler: () => this.addPicture('library')
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

    // Add picture from gallery or camera
    addPicture(source: string) {
        const options: CameraOptions = {
            quality: 60,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType:
                source === 'camera'
                    ? this.camera.PictureSourceType.CAMERA
                    : this.camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true
        };

        this.camera.getPicture(options).then(
            imageData => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                const base64Image = 'data:image/jpeg;base64,' + imageData;
                this.previousPicture = this.user.picture;
                this.user.picture = base64Image;
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

    // Upload picture to database and set as profile picture
    async submitPicture() {
        if (this.pictureBlob) {
            const path = `image/profile_${this.uuid}}`;
            const loading = await this.loadingCtrl.create({
                message: 'Uploading image, please wait'
            });

            this.task = this.storage.upload(path, this.pictureBlob);

            await this.task.then(data => {
                data.ref.getDownloadURL().then(downloadURL => {
                    loading.dismiss();
                    this.afs.doc(`users/${this.uuid}`).update({
                        picture: downloadURL
                    });
                });
            });
        }

        this.pictureAdded = false;
    }

    // Revert to original profile picture
    deletePicture() {
        this.user.picture = this.previousPicture;
        this.pictureAdded = false;
    }

    // Show uncropped picture when clicking on preview
    async showPicture() {
        if (this.user.picture) {
            const modal = await this.modalCtrl.create({
                component: ModalPicturePage,
                componentProps: { picture: this.user.picture },
                cssClass: 'picture-modal'
            });

            await modal.present();
        }
    }
}
