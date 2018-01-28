import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ChatService } from '../../providers/chat.service';


@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  @ViewChild(Content) content: Content;

  private selectedMessage;

  messageList: any[] = [];
  userId: string;
  last: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private chat: ChatService) {
  }

  getChats() {
    this.chat.searchMessages("12345_56789").snapshotChanges().subscribe(data => {
      console.log(data)
      this.last = data[9];
      this.messageList = [];
      data.forEach(element => {
        this.messageList.push(element.payload.doc.data());
      })
      this.messageList.reverse();
      console.log(this.messageList);
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    if (this.last) {
      this.chat.searchPaginated("12345_56789", this.last).snapshotChanges().subscribe(data => {
        this.last = data[9];
        data.forEach(element => {
          this.messageList.unshift(element.payload.doc.data());
        })
        refresher.complete();
      })
    }
    else {
      refresher.complete();
    }
  }

  ionViewDidLoad() {
    this.getChats();
    this.userId = "12345";
    setTimeout(() => {
      this.content.scrollToBottom(100);
    }, 1000);
  }

}
