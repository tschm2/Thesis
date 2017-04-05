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
import { AlertController } from 'ionic-angular';


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


  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public http: Http) {
    this.perDay = ['Morgen','Mittag','Abend','Nacht'];
    this.chmedHandler = new chmedJsonHandler(this.storage, this.http)
    this.barcodeService = new barcodeService(this.storage, this.http);
  }

  ionViewDidLoad() {
    this.barcodeService.analyseCHMED();
    this.storage.ready().then(()=>{
      this.storage.get('medicationData').then((res)=>{
        this.drugList = res;
        this.storage.get('mediPlan').then((res)=>{
        })
        })
      })



  }


  scanMedBox(){
    this.barcodeService.scanMediCode(this.drugList);
    this.storage.ready().then(()=>{
          this.storage.get('mediPlan').then((res)=>{
              res['Medicaments'] = this.drugList
              console.log(res)

            this.storage.set('mediPlan', JSON.parse(JSON.stringify(res)))
            this.storage.set("medicationData", JSON.parse(JSON.stringify(this.drugList)));
            })
    })

  //  this.barcodeService.scanMediCode();
  }
  deleteDrug(id){
    console.log(id)
    let alert = this.alertCtrl.create({
    title: 'Selbstmedikation löschen',
    message: 'Sind Sie sicher, dass sie '+id+' löschen möchten?',
    buttons: [
      {
        text: 'Nein',
        role: 'Nein',
        handler: () => {
          console.log('Nein clicked');
        }
      },
      {
        text: 'Ja',
        handler: () => {
        var tempList:any[];
        var i:number = 0;
        console.log("________________________________-")
     this.drugList = this.chmedHandler.deleteDrugFromArray(this.drugList,id)
          this.storage.ready().then(()=>{
          this.storage.set("medicationData", this.drugList);
          this.storage.get('mediPlan').then((res)=>{
            res['Medicaments'] = this.drugList

            this.storage.set('mediPlan', res)
          })
        })
        }
      }
    ]
  });
  alert.present();
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

  // Togglerone
  toggleContent(numb){
    if (this.toggleObject == numb)
    this.toggleObject = 0
    else
    this.toggleObject = numb;
    }


}
