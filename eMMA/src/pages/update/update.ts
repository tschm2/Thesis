import { barcodeService } from '../../services/barcodeService';
import { Storage } from '@ionic/storage'
import {Component} from '@angular/core';
import {QRCodeComponent} from 'angular2-qrcode';
import {ViewChild} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MedicationReminderViewPage } from '../../pages/medication-reminder-view/medication-reminder-view';
import { AlertController } from 'ionic-angular';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';

/*----------------------------------------------------------------------------*/
/* UpdatePage
/* tschm2, dornt1
/* This is the TypescriptFile of the UpdatePage
/* scanQRCode() is used to call the QRCode Function on Pressing the button
/* checkMidata() is used to get the CHMED16 String on Midata!

/* entryComponents include the QRCodeComponent This includes the QR-Code generting function
/* angular2-qrCode Library is used to handle the QR-Code genereting functions
/*----------------------------------------------------------------------------*/

@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
  entryComponents:[QRCodeComponent]
})

export class UpdatePage {

  /* The Link to the QR-Code element in the HTML */
  @ViewChild("qrCode") qrCode:QRCodeComponent;
  /* Using toggleObject to access the accordion */
  toggleObject:number;
  /* Calling the barcodeService */
  barcodeService: barcodeService;
  /* chmedJsonHandler to handle the JSON */
  chmedHandler: chmedJsonHandler;
  /* the Storage */
  storage:Storage;
  /* The Time of the actually Mediplan */
  mediplanTime:String;

  /**
     * @param  {Storage}               publicstorage    ionic storage from phone
     * @param  {AlertController}       publicalertCtrl  handle alerts
   */
  constructor(public http:Http, private alertCtrl: AlertController, storage:Storage) {
    this.storage = storage;
    this.barcodeService = new barcodeService(this.http, this.storage)
    this.chmedHandler = new chmedJsonHandler(this.storage)
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is called as soon the View loads!
  /* It gets the current mediPlan and generetates the qrCode
  /*----------------------------------------------------------------------------*/
    ionViewDidLoad() {
    this.storage.ready().then(()=>{
      this.storage.get('mediPlan').then((res)=>{
      var tempDate = new Date(res["Dt"].substring(0, 10))
      this.mediplanTime = tempDate.toLocaleDateString()
      })
    })
    this.chmedHandler.getCHMEDString().then((chmed16) => {
      this.qrCode.value = chmed16
      console.log(chmed16)
      this.qrCode.generate();
    })
    }

    /*----------------------------------------------------------------------------*/
    /* This Method is called when scanQRCode Button is pressed
    /* Calls the barcodeServie.scanQRCode
    /*----------------------------------------------------------------------------*/
    scanQRcode(){
    this.storage.ready().then(()=>{
      this.barcodeService.scanQRcodeForJSON().then((res)=>{
        if(res){
          let alert = this.alertCtrl.create({
          title: 'Erfolgreich',
          subTitle: 'Der Medikationsplan wurde erfolgreich eingelesen. Unter meine Medikation sind nun alle deine Medikamente aufgelistet.',
          buttons: ['Ok']
          });
          }
          else{
            console.log("something went WRONG");
          }
          });
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
}
