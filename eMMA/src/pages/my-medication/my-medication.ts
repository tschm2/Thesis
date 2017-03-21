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
  parsedData:JSON;
  perDay:String[];
  toggleObject:number;
  chmedHandler: chmedJsonHandler;
  barcodeService: barcodeService;
  // DOM ELEMENTS
  drugList:JSON;
  patient:JSON;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.perDay = ['Morgen','Mittag','Abend','Nacht'];
    this.chmedHandler = new chmedJsonHandler(this.storage)
    this.barcodeService = new barcodeService(this.storage);
  }

  ionViewDidLoad() {
    this.storage.ready().then(()=>{
      this.chmedHandler.getChmedJson().then((res) => {
      this.drugList = this.chmedHandler.getMedicationArray(res)
      })
  })
  }
  // Togglerone
  toggleContent(numb){
    if (this.toggleObject == numb)
    this.toggleObject = 0
    else
    this.toggleObject = numb;
    }


}
