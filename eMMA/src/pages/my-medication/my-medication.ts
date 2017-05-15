import { Component } from '@angular/core';
import { barcodeService } from '../../services/barcodeService';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';
import { Storage } from '@ionic/storage'
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';


/*----------------------------------------------------------------------------*/
/* MedicationPage
/* tschm2, dornt1
/* This is the TypescriptFile of the MedicationPage
/*
/* makeNutritionObject() used to create the NutritionObject for the Page
/*
/*----------------------------------------------------------------------------*/

@Component({
  selector: 'page-my-medication',
  templateUrl: 'my-medication.html',
})
export class MyMedicationPage {

  /* TheParsed Data of the JSON */
  parsedData:JSON;
  /* Using toggleObject to access the accordion */
  toggleObject:number;
  /* Calling the barcodeService */
  barcodeService: barcodeService;
  /* chmedJsonHandler to handle the JSON */
  chmedHandler: chmedJsonHandler;

  // Dom Element
  drugList:JSON;
  patient:JSON;
  perDay:String[];

  // Mo Mi Ab Na for the DOM
  morning:any;
  midday:any;
  evening:any;
  night:any;
  reason:any;
  // Mo Mi Ab Na for the Settings
  sMorning:any;
  sMidday:any;
  sEvening:any;
  sNight:any;
  sound:any;

  /**
     * get nutrition detail list from storage and create the nutrition list
     * @param  {Storage}               publicstorage    ionic storage from phone
     * @param  {AlertController}       publicalertCtrl  handle alerts
   */
  constructor(public http:Http, private alertCtrl: AlertController,  public storage: Storage) {
    this.perDay = ['Morgen','Mittag','Abend','Nacht'];
    this.chmedHandler = new chmedJsonHandler(this.storage)
    this.barcodeService = new barcodeService(http, this.storage);
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is called as soon the View loads!
  /* It gets the current mediPlan and sets it as the drugList for the DOM
  /* TakingTimes from Storages are called and Set to the DOM
  /* The choosen Sound for the Reminder is set
  /*----------------------------------------------------------------------------*/
  ionViewDidLoad() {
    this.storage.ready().then(()=>{
      this.storage.get('medicationData').then((res)=>{
        this.drugList = res;
      })
      this.storage.get('takingTime').then((res)=>{
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

  /*----------------------------------------------------------------------------*/
  /* This Method is called when the ScanMediCode is pressed
  /* It opens the BarcodeServiceScanner and addes the Medication to the List
  /*----------------------------------------------------------------------------*/
  scanMedBox(){
  this.barcodeService.scanMediCode(this.drugList,this.morning,this.midday,this.evening,this.night,this.reason).then((res)=>{
    console.log(res)
    // Opens Alert to notifiy the User
    let alert = this.alertCtrl.create({
      title: 'Arztneimittel erfasst!',
      subTitle: 'Das Arztneimittel wurde erfolgreich erfasst',
      buttons: ['Ok']
    });
    this.storage.ready().then(()=>{
      this.storage.get('mediPlan').then((res)=>{
        res['Medicaments'] = this.drugList
        this.storage.set('mediPlan', res).then(()=>{
          this.barcodeService.doChecksWithCurrentMedication();
        })
        this.storage.set("medicationData", this.drugList);
        alert.present();
        // Edits the ComplianceDataObject
        this.editComplianceData(res['Medicaments'][res['Medicaments'].length-1].title)
      })
    })
    this.toggleObject = 0
    })
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is called as soon the MedicationButtonWithoutScanning is pressed
  /* It adds a Medication without the scanning of the Barcode to the DrugList
  /*----------------------------------------------------------------------------*/
  setMedicationWithoutScanning(){
    // Creating alert, to set the Name of the Medication
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

            // Set the Date of the Medication to Today
            var today:any = new Date();
            var dd:any = today.getDate()
            var mm:any = today.getMonth()+1; //January is 0!
            var yyyy:any = today.getFullYear();
            if(dd<10) {
              dd='0'+dd
            }

            if(mm<10) {
              mm='0'+mm
            }
            today = yyyy+'-'+mm+'-'+dd;
            // Create Object of the Medication
            var tempObj = ({
              "AppInstr":"Arzt oder Apotheker fragen.",
              "TkgRsn":this.reason,
              "AutoMed":"1",
              "Id":data.name,
              "IdType":"1",
              "Unit":"",
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
                this.editComplianceData(data.name)
              })
            })
            // Create Notification for the User
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
  /*----------------------------------------------------------------------------*/
  /* This Method is called when a SelfMedication is getting deleted
  /* It Removes the Drug from the Druglist
  * @param title  Title of the Medication
  * @param id     ID of the Medication
  /*----------------------------------------------------------------------------*/
  deleteDrug(title,id){
    let alert = this.alertCtrl.create({
      title: 'Selbstmedikation löschen',
      message: 'Bist du sicher, dass du <b>'+title+'</b> löschen möchten?',
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
  /*----------------------------------------------------------------------------*/
  /* Saving Settings will call this Function
  /* It saves the TakingTime and Sound to the STorage
  /*----------------------------------------------------------------------------*/
  saveTakingTimes(){
    let tempTakingTime = [this.sMorning,this.sMidday,this.sEvening,this.sNight]
    this.storage.set('takingTime',tempTakingTime)
    this.storage.set('sound', this.sound)
    this.toggleObject = 0
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is called when the DrugList Array is getting edited.
  /* It overrites the current CompliacneData
  /*----------------------------------------------------------------------------*/
  editComplianceData(name){
    this.storage.get('ComplianceData').then((res)=>{
      res.DrugList.push({
        "Name":name,
        "Compliance":[]
      })
      this.storage.set('ComplianceData',res)
    })
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is used to toggle The Content accordion
  /*----------------------------------------------------------------------------*/
  toggleContent(numb){
  if (this.toggleObject == numb)
    this.toggleObject = 0
  else
    this.toggleObject = numb;
  }

  /*----------------------------------------------------------------------------*/
  /* This Method sets the Focus to the InputField
  /*----------------------------------------------------------------------------*/
  focusReason(el){
    setTimeout(() => {
      el.setFocus();
    },150);
  }
}
