import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable()
export class ChatService {

  private messagesRef: AngularFirestoreCollection<any>;
  private lastMessageRef: AngularFirestoreDocument<any>;
  private freelancersRef: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore) {    
  }

  searchMessages(messageId) {
    this.messagesRef = this.afs.collection(`messages2`, ref => ref.where('messageId', '==', messageId).orderBy('timeStamp', 'desc').limit(10));
    return this.messagesRef;
  }

  searchMessages2() {
    this.messagesRef = this.afs.collection(`messages2`, ref => ref.where('messageId', '==', "12345_56789").orderBy('timeStamp', 'desc'));
    return this.messagesRef;
  }

  searchPaginated(messageId, last) {
    this.messagesRef = this.afs.collection(`messages2`, ref => ref.where('messageId', '==', messageId).orderBy('timeStamp', 'desc').startAfter(last.payload.doc.data().timeStamp).limit(10));
    return this.messagesRef;
  }

  async saveMessage(message: any) {
    this.messagesRef = this.afs.collection(`messages2`);
    try {
      await this.messagesRef.add(message);
      console.log(message);
      return true;
    }
    catch(e) {
      console.error(e);
      return false;
    }
  }

}