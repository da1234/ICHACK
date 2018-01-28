import { Component, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureImageOptions } from '@ionic-native/media-capture';
import { Loading, LoadingController, ToastController, ActionSheetController, Content } from 'ionic-angular';
import { VideoService } from '../../providers/video.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-message-box',
  templateUrl: 'message-box.component.html'
})
export class MessageBoxComponent {

  @ViewChild(Content) content: Content;

  @Output() sendMessage: EventEmitter<string>
  serviceMedia: string;
  serviceMediaFull: any;
  serviceId: number;
  category: string;
  downloadUrl: any;
  subcategory: string;
  serviceDisableStatus: boolean;
  caption: string;
  private loader: Loading;
  private videoAdded: boolean;
  private pictureAdded: boolean;

  constructor(private camera: Camera, 
              private mediaCapture: MediaCapture,
              private toast: ToastController,
              private loading: LoadingController,
              private videoService: VideoService,
              private actionSheetCtrl: ActionSheetController) {
    console.log('Hello MessageBoxComponent Component');
    this.sendMessage = new EventEmitter<string>();
    this.videoAdded = false;
    this.pictureAdded = false;

  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add Picture',
      buttons: [
        {
          text: 'Take Picture',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Choose from Library',
          handler: () => {
            this.addPicture();
          }
        },{
          text: 'Cancel',
          role: 'destructive',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  addPicture() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((file) => {
      let base64Image = 'data:image/jpeg;base64,' + file;
      this.serviceMedia = file;
      this.serviceMediaFull = base64Image;
      this.pictureAdded = true;
      this.serviceDisableStatus = false;
    }, (err) => {
      console.log('an error occured with the camera', err.message);
    });
  }

  async takePicture() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
    }
    this.camera.getPicture(options).then((file) => {
      let base64Image = 'data:image/jpeg;base64,' + file;
      console.log('got file: ', base64Image);
      this.serviceMedia = file;
      this.serviceMediaFull = base64Image;
      this.pictureAdded = true;
      this.serviceDisableStatus = false;
    }, (err) => {
      console.log('an error occured with the camera', err.message);
    });
  }

  displayToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000,
    });
    toast.present()
  }

  async onFinish() {
    var message = "";

    if (this.pictureAdded == false) {
      message = 'Please add a picture.';
      this.displayToast(message);
      return;
    }

    else {

      this.loader = this.loading.create({
        content: 'Animating your picture...'
      });
      this.loader.present();
      var imageId = (new Date()).getTime();
      console.log('on finish');

      var storageRef = firebase.storage().ref();
      var serviceMediaRef = storageRef.child(`${imageId}.jpg`);
      try {
        var snapshot;
        var type = 'picture';
        if (this.pictureAdded) {
          snapshot = await serviceMediaRef.putString(this.serviceMediaFull, 'data_url');
        } else if (this.videoAdded) {
          snapshot = await serviceMediaRef.put(this.serviceMediaFull);
        }
        console.log('placed in storage');
        var batch = firebase.firestore().batch(); 
        var downloadUrl = snapshot.downloadURL;
        this.downloadUrl = downloadUrl

        var image = {
          postId: imageId,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          content: downloadUrl,
          userFromProfile: {
            firstName: "Rick",
            secondName: "Wong"
          },
          userToProfile: {
            firstName: "Darrell",
            secondName: "Adjei"
          },
          userToId: "56789",
          userFromId: "12345",
          messageId: "12345_56789"
        };

        const result = await this.videoService.uploadPic(image, imageId);
        console.log(result);

        this.pictureAdded = false;
        this.loader.dismiss();
        this.content.scrollToBottom(300);

      } catch (e) {
        console.log(e);
      }
    }
  }

}
