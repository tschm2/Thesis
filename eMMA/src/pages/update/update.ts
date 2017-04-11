import { NavController, NavParams } from 'ionic-angular';
import { barcodeService } from '../../services/barcodeService';
import { Storage } from '@ionic/storage'
import {Component} from '@angular/core';
import {QRCodeComponent} from 'angular2-qrcode';
import {ViewChild} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

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
  test:String;
  constructor(public http:Http, public navCtrl: NavController, public navParams: NavParams, storage:Storage) {
    this.storage = storage;
    this.barcodeService = new barcodeService(this.http, this.storage)
  }

  ionViewDidLoad() {
    this.barcodeService.getCHMEDString().then((chmed16) => {
      this.qrCode.value = chmed16
      this.qrCode.generate();
    })
  }


  scanQRcode(){
    this.storage.ready().then(()=>{
      this.barcodeService.scanQRcodeForJSON();
    })
  }

  toggleContent(numb){
  if (this.toggleObject == numb)
    this.toggleObject = 0
  else
    this.toggleObject = numb;
  }
}
