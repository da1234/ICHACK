import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Injectable()
export class VideoService {

  private videoRef: AngularFirestoreDocument<any>;
  private imageRef: AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore) {
    console.log('Hello VideoProvider Provider');
  }

  async uploadPic(picture, imageId) {
    try {
      this.imageRef = this.afs.doc(`HackImages/${imageId}`);
      await this.imageRef.set(picture);
      return true;
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  async uploadVideo(videos, imageId) {
    try{
      this.videoRef = this.afs.doc(`videos/${imageId}`);
      await this.videoRef.set(videos);
      return true;
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

}