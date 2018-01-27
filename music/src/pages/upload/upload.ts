import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions, CaptureImageOptions } from '@ionic-native/media-capture';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  serviceMedia: string;
  serviceMediaFull: any;
  serviceId: number;
  category: string;
  subcategory: string;
  serviceDisableStatus: boolean;
  caption: string;
  private loader: Loading;
  private videoAdded: boolean;
  private pictureAdded: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private camera: Camera, 
              private mediaCapture: MediaCapture,
              private loading: LoadingController,
              private toast: ToastController,) {
    this.loader = this.loading.create({
      content: 'Adding music to video...'
    });
    this.videoAdded = false;
    this.pictureAdded = false;
  }

  async addVid() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.VIDEO
    }
    try {
      var file = await this.camera.getPicture(options)
      console.log('got file:', file);
      console.log('got file:', file.substring(7));
      var blob = await this.makeFileIntoBlob(file.substring(7));
      this.serviceMediaFull = blob;
      this.serviceDisableStatus = false;
      this.videoAdded = true;
    } catch (err) {
      console.log('an error occured with the camera', err.message);
    }

  }

  async takeVid() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 10
    };
    try {
      var data = await this.mediaCapture.captureVideo(options)
      console.log('got file: ', data[0].fullPath);
      var blob = await this.makeFileIntoBlob(data[0].fullPath);
      console.log('got blob:', blob);
      this.serviceMediaFull = blob;
      this.serviceDisableStatus = false;
      this.videoAdded = true;
    } catch (err) {
      console.error('there was an error with the video capture', err)
    }
  }

  async onFinish() {
    var message = "";

    /*cehck services were selected*/
    if (this.videoAdded == false) {
      message = 'Please add a video.';
      this.displayToast(message);
      return;
    }

    else {

      /*else*/
      this.loader.present();
      var imageId = (new Date()).getTime();
      console.log('on finish');

      /*format the name for firebase*/
      var storageRef = firebase.storage().ref();
      var serviceMediaRef = storageRef.child(`music/videos/${imageId}.mp4`);
      try {
        var snapshot;
        var type = 'video';
        if (this.pictureAdded) {
          snapshot = await serviceMediaRef.putString(this.serviceMediaFull, 'data_url');
        } else if (this.videoAdded) {
          snapshot = await serviceMediaRef.put(this.serviceMediaFull);
        }
        console.log('placed in storage');
        var batch = firebase.firestore().batch(); /*for running batch*/
        var downloadUrl = snapshot.downloadURL;

        /*make post and send to all*/
        var videos = {
          postId: imageId,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          URL: downloadUrl,
          type: type
        };

        firebase.firestore().collection('videos')
          .doc(`${imageId}`)
          .set(videos);

        this.loader.dismiss();
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      } catch (err) {
        console.log('something went wrong with the batch', err.message);
      }
    }
  }

  makeFileIntoBlob(_imagePath) {
  console.log('entered');
    return fetch(_imagePath).then((_response) => {
      return _response.blob();
    }).then((_blob) => {
      return _blob;
    }).catch((e) => {
      console.log('Failed file read: ' + e.toString());
    });
  }

  displayToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000,
    });
    toast.present()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPage');
  }

}
