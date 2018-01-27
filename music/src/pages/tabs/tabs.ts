import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: string;
  tab2Root: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab1Root = 'VideoPage';
    this.tab2Root = 'UploadPage';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
