import { barcodeService } from '../../services/barcodeService';
import { Storage } from '@ionic/storage'
import { Component } from '@angular/core';
import { QRCodeComponent } from 'angular2-qrcode';
import { ViewChild } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';
import { Midata } from 'midata';



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
  constructor(private alertCtrl: AlertController, storage:Storage) {
    this.storage = storage;
    this.barcodeService = new barcodeService(this.storage)
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
          alert.present();
          }
          else{
            console.log("something went WRONG");
          }
          });
        })
    }

    /*----------------------------------------------------------------------------*/
    /* This Method is called when Abgleich mit Midata Button is pressed
    /* It builds a connection to Midata with username and password entered.
    /* If the username and password is correct, the compareCHMED16DAte function will becalled
    /* If the eMediplan on Midata is more current, the one gets downloaded and saved in the application
    /* else the current Medicationdata will get uploaded and stored on Midata!
    /*----------------------------------------------------------------------------*/

    updateFromMidata(username:string, password:string){
      console.log(username, password)
      let midata = new Midata("https://test.midata.coop:9000","eMMA","W1KAS4hxm1Ljd01j78e2ZTeMEzgczz0w");
      //  let uName = "marie@emma.ch"
      //  let uPassword = "Emma1234."
      midata.login(username,password).then((AuthToken)=>{
      console.log(AuthToken)

      midata.search("Device").then((res)=>{
        this.barcodeService.compareCHMED16Date((res[0].udi.name)).then((newMediplan)=>{
            var tk = {
              resourceType: "Device",
              status: 'active',
              udi : { // Unique Device Identifier (UDI) Barcode string
                deviceIdentifier : "eMediplan", // Mandatory fixed portion of UDI
                name : newMediplan, // Device Name as appears on UDI label
                jurisdiction : "eMMA", // Regional UDI authority
                carrierHRF : "-", // UDI Human Readable Barcode String
                carrierAIDC : "-", // UDI Machine Readable Barcode String
                issuer : "eMMA", // UDI Issuing Organization
                entryType : "manual" // barcode | rfid | manual +
              }
            }
            midata.save(tk)
            let alert = this.alertCtrl.create({
            title: 'Erfolgreich',
            subTitle: 'Auf MIDATA ist nun die aktuelle Medikation gespeichert.',
            buttons: ['Ok']
            });
            alert.present();
            this.toggleObject = 0;
          })
        });
      });




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
