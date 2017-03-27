import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { barcodeService } from '../../services/barcodeService';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';
import { HCIService } from '../../services/HCIService';
import { Storage } from '@ionic/storage'
import {Request, RequestMethod,Response} from '@angular/http';
import {Injectable} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import myPako from "../../node_modules/pako"

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


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http) {
    this.perDay = ['Morgen','Mittag','Abend','Nacht'];
    this.chmedHandler = new chmedJsonHandler(this.storage, this.http)
    this.barcodeService = new barcodeService(this.storage, this.http);
  }

  ionViewDidLoad() {
    this.storage.ready().then(()=>{
      this.storage.get('medicationData').then((res)=>{
        this.drugList = res;

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

  scanMedBox(){
    this.barcodeService.scanMediCode(this.drugList);

  //  this.barcodeService.scanMediCode();
  }
    test(artbar) {
    // preparing variables
    var api = 'http://www.laettere.ch/carole/mina/getArticle.php';
    //console.log(api);
    var keytype = 'ARTBAR';
    //console.log(keytype);
    var key = artbar;
    //console.log(key);
    var index = 'hospINDEX';
    //console.log(index);

    // concat uri
    var uri = api + '?keytype=' + keytype + '&key=' + key + '&index=' + index;

    return this.http.get(uri).toPromise().then(function(response){
      return response;
    })
  }



}
