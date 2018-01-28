import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: 'chat-message.component.html'
})
export class ChatMessageComponent {

  @Input() chatMessage: any;
  @Input() userId: string;
  audio: any;
  played: boolean;
  class1: string;

  constructor() {
    console.log('Hello ChatMessageComponent Component');
    this.played = false;
  }

  applyClass() {
    this.class1 = "fivePhasesFadeIn";
  }

  playMusic(chatMessage) {

    if (!this.played) {
      if (chatMessage.emotion == "anger") {
        this.class1 = "infinite-spinning";
      }
      else if (chatMessage.emotion == "happiness") {
        this.class1 = "bounce";
      }
      else if (chatMessage.emotion == "neutral") {
        this.class1 = "fivePhasesFadeIn";
      }
      else if (chatMessage.emotion == "sadness") {
        this.class1 = "sadness";
      }
      else if (chatMessage.emotion == "fear") {
        this.class1 = "fivePhasesFadeIn";
      }
      else if (chatMessage.emotion == "contempt") {
        this.class1 = "disgust";
      }
      else if (chatMessage.emotion == "disgust") {
        this.class1 = "disgust";
      }
      else if (chatMessage.emotion == "surprise") {
        this.class1 = "scaling";
      }
      this.audio = new Audio();
      this.audio.src = chatMessage.audio;
      this.audio.load();
      this.audio.play();
      this.played = true;
      
    }
    else {
      this.audio.pause();
      this.played = false;
    }

  }

}