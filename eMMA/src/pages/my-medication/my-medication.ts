import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { barcodeService } from '../../services/barcodeService';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';
import { Storage } from '@ionic/storage'


/*
  Generated class for the MyMedication page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-medication',
  templateUrl: 'my-medication.html',
})
export class MyMedicationPage {
  drugList:JSON;
  patient:JSON;
  parsedData:JSON;
  perDay:String[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.perDay = ['Morgen','Mittag','Abend','zur Nacht'];
  }

  ionViewDidLoad() {
  this.storage.ready().then(() => {

    let myScanner = new barcodeService(this.storage);
    myScanner.testDummyData();

    this.storage.get('parsedData').then((val) => {
        this.parsedData=val;
        let myChmedHandler = new chmedJsonHandler(this.parsedData);
        this.drugList = myChmedHandler.getMedicationArray();
        console.log(this.drugList);

      })





})
  }


}
