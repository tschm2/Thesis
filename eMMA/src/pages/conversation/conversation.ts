import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from 'ionic-native';

/*
  Generated class for the Conversation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class ConversationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {

    console.log('ionViewDidLoad ConversationPage');
  }

}
