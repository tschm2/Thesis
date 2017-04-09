import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';


/*
  Generated class for the Nutrition page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html',

})
export class NutritionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage) {
    this.storage.get('test2').then((val) => {
            console.log(val);
          })
         }

  ionViewDidLoad() {}


}
