import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AboutEmma page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-about-emma',
  templateUrl: 'about-emma.html'
})
export class AboutEmmaPage {
  toggleObject:number;
  chatlog: Array<{text: string, identity: string, time: string}>;


  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage) {}

  ionViewDidLoad() {
    this.storage.get('chatlog').then((val) => {
    this.chatlog = val;
    this.name = this.chatlog.length;
  });
    console.log('ionViewDidLoad AboutEmmaPage');
  }
  toggleContent(numb){
    if (this.toggleObject == numb)
    this.toggleObject = 0
    else
    this.toggleObject = numb;
    }

}
