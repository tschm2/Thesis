import { Component,ViewChild,ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { barcodeService } from '../../services/barcodeService';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';


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

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {


  /*Testing*/
    let myScanner = new barcodeService();
    let dummyData = myScanner.testDummyData();
    let myChmedHandler = new chmedJsonHandler(dummyData);
    let myDrugs: JSON = myChmedHandler.getMedicationArray();
    console.log(myDrugs);
    let myPatient: JSON = myChmedHandler.getPatient();
    console.log(myPatient);
    let obj = JSON.parse(dummyData);
    console.log(obj);


}


}
