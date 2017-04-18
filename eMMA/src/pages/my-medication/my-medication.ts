import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { barcodeService } from '../../services/barcodeService';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';
import { Storage } from '@ionic/storage'
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

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
  morning:any;
  midday:any;
  evening:any;
  night:any;
  reason:any;
  sMorning:any;
  sMidday:any;
  sEvening:any;
  sNight:any;
  sound:any;



  constructor(public http:Http, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.perDay = ['Morgen','Mittag','Abend','Nacht'];
    this.chmedHandler = new chmedJsonHandler(this.storage)
    this.barcodeService = new barcodeService(http, this.storage);
  }

  ionViewDidLoad() {

      this.storage.ready().then(()=>{
        this.storage.get('medicationData').then((res)=>{
          this.drugList = res;
        })
        this.storage.get('takingTime').then((res)=>{
          console.log(res)
          this.sMorning = res[0]
          this.sMidday = res[1]
          this.sEvening = res[2]
          this.sNight = res[3]
        })
        this.storage.get('sound').then((res)=>{
          this.sound = res;
        })
      })
    }

  scanMedBox(){
    this.barcodeService.scanMediCode(this.drugList,this.morning,this.midday,this.evening,this.night,this.reason).then((res)=>{
      console.log(res)
      this.storage.ready().then(()=>{
        this.storage.get('mediPlan').then((res)=>{
          res['Medicaments'] = this.drugList
          this.storage.set('mediPlan', res)
          this.storage.set("medicationData", this.drugList);
        })
      })
    this.toggleObject = 0
    })
  }
  setMedicationWithoutScanning(){

  let alert = this.alertCtrl.create({
    title: 'Name des Arztneimittels erfassen',
    inputs: [
      {
        name: 'name',
        placeholder: 'Name'
      },
    ],
    buttons: [
      {
        text: 'Abbrechen',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Erfassen',
        handler: data => {

          if(this.morning==true)this.morning=1
          else this.morning = 0
          if(this.midday==true)this.midday=1
          else this.midday = 0
          if(this.evening==true)this.evening=1
          else this.evening = 0
          if(this.night==true)this.night=1
          else this.night = 0

          var today:any = new Date();
          var dd:any = today.getDate();
          var mm:any = today.getMonth()+1; //January is 0!
          var yyyy:any = today.getFullYear();
          if(dd<10) {
              dd='0'+dd
          }

          if(mm<10) {
              mm='0'+mm
          }
          today = yyyy+'-'+dd+'-'+mm;

          var tempObj = ({
            "AppInstr":"Arzt oder Apotheker fragen.",
            "TkgRsn":this.reason,
            "AutoMed":"1",
            "Id":data.name,
            "IdType":"3",
            "description":data.name,
            "title":data.name,
            "PrscbBy":"mir als Patient",
            "Pos":[{
              "D":[
                this.morning,
                this.midday,
                this.evening,
                this.night
              ],
              "DtFrom":today
            }]
          })
          var tempList:any = this.drugList;
          tempList.push(tempObj)
          this.storage.ready().then(()=>{
            this.storage.get('mediPlan').then((res)=>{
              res['Medicaments'] = this.drugList
              this.storage.set('mediPlan', res)
              this.storage.set("medicationData", this.drugList);
            })
          })

          let alert = this.alertCtrl.create({
            title: 'Arztneimittel erfassen',
            subTitle: 'Das Arztneimittel wurde erfolgreich erfasst',
            buttons: ['Ok']
          });
          alert.present();
          this.toggleObject = 0
        }
      }
    ]
  });
  alert.present();
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

  saveTakingTimes(){
    let tempTakingTime = [this.sMorning,this.sMidday,this.sEvening,this.sNight]
    this.storage.set('takingTime',tempTakingTime)
    this.storage.set('sound', this.sound)
    this.toggleObject = 0
  }

  toggleContent(numb){
    if (this.toggleObject == numb)
      this.toggleObject = 0
    else
      this.toggleObject = numb;
  }
}
