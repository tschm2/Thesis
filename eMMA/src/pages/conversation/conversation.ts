import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import {ViewChild, Component, ElementRef} from '@angular/core';
import {Content} from 'ionic-angular/index';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})

export class ConversationPage {

  @ViewChild(Content)  content: Content;
  messages: any[];
  preAnswers: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage) {
    this.messages = [];
    this.preAnswers = [];

  }

  ionViewDidLoad() {
    this.OverrideAnswerButtons("hello", "doSomething", "hello2", "doSomething")
  }
  reply(answer) {

    this.messages.push({
      text: answer.text,
      identity: 'user'
    })

    this[answer.callFunction]();
    this.OverrideAnswerButtons("hello", "doSomething", "hello2", "doSomething")
    this.content.scrollToBottom();
  }
  doSomething() {
    this.storage.ready().then(() => {
      this.storage.set('test', 'das');
    })
    this.storage.get('test').then((val) => {
            console.log(val);
          })
  }
  OverrideAnswerButtons(text1: String, function1: String, text2: String, function2: String) {
    this.preAnswers = [];
    for (let i = 1; i <= 2; i++) {
      this.preAnswers.push({
        text: eval("text" + i),
        id: i,
        callFunction: eval("function" + i)
      });
    }
  }

  sendMessage(myReply) {
    console.log(myReply);
    this.messages.push({
      text: myReply.value,
      identity: 'user'
    })
    myReply.value = null;
    this.content.scrollToBottom();
  }


}
