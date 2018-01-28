import { NgModule } from '@angular/core';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [ChatMessageComponent,
    MessageBoxComponent],
	imports: [IonicModule],
	exports: [ChatMessageComponent,
    MessageBoxComponent]
})
export class ComponentsModule {}
