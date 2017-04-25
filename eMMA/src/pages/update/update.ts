import { NavController, NavParams } from 'ionic-angular';
import { barcodeService } from '../../services/barcodeService';
import { Storage } from '@ionic/storage'
import {Component} from '@angular/core';
import {QRCodeComponent} from 'angular2-qrcode';
import {ViewChild} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MedicationReminderViewPage } from '../../pages/medication-reminder-view/medication-reminder-view';
/*



*/
@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
  entryComponents:[QRCodeComponent]
})

export class UpdatePage {

  @ViewChild("qrCode") qrCode:QRCodeComponent;
  toggleObject:number;
  barcodeService: barcodeService;
  storage:Storage;
  mediplanTime:String;
  test:any;
  constructor(public http:Http, public navCtrl: NavController, public navParams: NavParams, storage:Storage) {
    this.storage = storage;
    this.barcodeService = new barcodeService(this.http, this.storage)
  }

  ionViewDidLoad() {
    console.log(this.navParams.get("complianceData"));
    this.storage.ready().then(()=>{
      this.storage.get('mediPlan').then((res)=>{
        var tempDate = new Date(res["Dt"].substring(0, 10))
        this.mediplanTime = tempDate.toLocaleDateString()
        console.log(res)
      })
    })
      this.barcodeService.getCHMEDString().then((chmed16) => {
      this.qrCode.value = chmed16
      console.log(chmed16)
      this.qrCode.generate();
    })
  }


  scanQRcode(){
    this.storage.ready().then(()=>{
      this.barcodeService.scanQRcodeForJSON().then((res)=>{
          console.log(res)
      });
    })
  }

  toggleContent(numb){
  if (this.toggleObject == numb)
    this.toggleObject = 0
  else
    this.toggleObject = numb;
  }
  navParam(){
    /*this.navCtrl.push(MedicationReminderViewPage,{
        state: 0
      });*/
      new Promise((resolve, reject) => {
        this.navCtrl.push(MedicationReminderViewPage, {state: 1, resolve: resolve});
      }).then(data => {
        console.log(data)
      });

}
}
