import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import {ViewChild, Component, ElementRef} from '@angular/core';
import {Content} from 'ionic-angular/index';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})

export class ConversationPage {

    @ViewChild(Content)
    content: Content;
    messages: any[];
    preAnswers: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.messages = [];
  this.preAnswers = [];
  for (let i = 0; i < 2; i++) {
    this.preAnswers.push({
      text: 'Answer ' + i,
      id: i,
      doFunction:"doSomething(answer)"
    });
  }
  console.log(this.preAnswers);
  }

  ionViewDidLoad() {

    }
    reply(answer) {
      this.messages.push({
        text: answer.text,
        identity: 'user'

      })
      this.content.scrollToBottom();
        this.preAnswers = [];
        this.preAnswers.push({
          text: 'Neui ANtwort',
          id:2,
          doFunction:"doSomething(answer)"

        })
        this.preAnswers.push({
          text: 'Neui ANtwort2',
          id:2,
          doFunction:"doSomething(answer)"

        })
    }
    doSomething(answer){
      this.reply(answer);
    }
    


  }
