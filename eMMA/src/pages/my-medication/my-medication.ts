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
  test:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.storage.ready().then(() => {
      this.storage.set('test', 'das');
    })

  }

  ionViewDidLoad() {

  this.storage.get('test').then((val) => {
          console.log(this.test = val);
        })

    let myScanner = new barcodeService(this.storage);
    let dummyData:JSON = myScanner.testDummyData();
    // Data Generiert

    let myChmedHandler = new chmedJsonHandler(dummyData);

    this.drugList = myChmedHandler.getMedicationArray();
    console.log(this.drugList);
    this.patient = myChmedHandler.getPatient();
    console.log(this.patient);
      this.storage.ready().then(() => {
      this.storage.get('test2').then((val) => {
              console.log(this.test = val);
            })
          })


  }


}
