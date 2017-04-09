import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { barcodeService } from '../../services/barcodeService';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';
import { Storage } from '@ionic/storage'
import { AlertController } from 'ionic-angular';

/*



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


  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.perDay = ['Morgen','Mittag','Abend','Nacht'];
    this.chmedHandler = new chmedJsonHandler(this.storage)
    this.barcodeService = new barcodeService(this.storage);
  }

  ionViewDidLoad() {
    this.barcodeService.analyseCHMED();
      this.storage.ready().then(()=>{
        this.storage.get('medicationData').then((res)=>{
          this.drugList = res;
        })
      })
    }

  scanMedBox(){
    this.barcodeService.scanMediCode(this.drugList);
      this.storage.ready().then(()=>{
        this.storage.get('mediPlan').then((res)=>{
          res['Medicaments'] = this.drugList
          this.storage.set('mediPlan', JSON.parse(JSON.stringify(res)))
          this.storage.set("medicationData", JSON.parse(JSON.stringify(this.drugList)));
        })
      })
  }

  deleteDrug(id){
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

  toggleContent(numb){
    if (this.toggleObject == numb)
      this.toggleObject = 0
    else
      this.toggleObject = numb;
  }
}
