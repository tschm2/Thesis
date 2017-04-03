import { NavController, NavParams } from 'ionic-angular';
import { barcodeService } from '../../services/barcodeService';
import { Storage } from '@ionic/storage'
import { Http, Headers, RequestOptions } from '@angular/http';
import {Component, OnInit} from '@angular/core';
//import {QRCodeComponent} from 'ng2-qrcode'
import {QRCodeComponent} from 'angular2-qrcode';
import {ElementRef,ViewChild} from '@angular/core';


/*
  Generated class for the Update page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
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
  constructor(public navCtrl: NavController, public navParams: NavParams, storage:Storage, public http:Http) {
  this.storage = storage;
  this.barcodeService = new barcodeService(this.storage, this.http)
  }

  ionViewDidLoad() {

    this.barcodeService.getCHMEDString().then((chmed16) => {
      console.log(chmed16)
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
