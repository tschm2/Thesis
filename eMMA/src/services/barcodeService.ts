import { Injectable } from '@angular/core';
import { BarcodeScanner } from 'ionic-native';
import myPako from "../../node_modules/pako"
import { Storage } from '@ionic/storage';
import { HCIService } from './HCIService';
import { HciHospAPI } from 'hci-hospindex-api';
import  * as  HCITypes from 'hci-hospindex-api/src/api';
import { chmedJsonHandler } from '../services/chmedJsonHandler';
import { Midata } from 'midata';

/*----------------------------------------------------------------------------*/
/* barcodeService
/* tschm2
/* In this class the BarcodeScanner is getting Handled!
/* All Function with scanning single Medication or the eMediplan are included
/*
/*----------------------------------------------------------------------------*/

@Injectable()
export class barcodeService {
private list: Array<any>;
private chmedHandler: chmedJsonHandler;

  /**
     * @param  {Storage}               publicstorage    ionic storage from phone
   */
  constructor(public storage: Storage) {
    this.chmedHandler = new chmedJsonHandler(this.storage)
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is used to Scan the QR-Code of the eMediplan
  /* It returns a Promise with True or False if the scan was successfull
  /*----------------------------------------------------------------------------*/
  scanQRcodeForJSON():any{
  return BarcodeScanner.scan().then((barcodeData) => {
         this.saveMedicationInformation(barcodeData.text)
     return true
      // Success! Barcode data is here
      // für Tests wenn HCIquery nicht funktioniert: DummyDaten verwenden
       // this.testDummyData();
       // alert("Medikation wurde gespeichert.");
    }, (err) => {
      console.log("Woops falscher QR-Code, zu Testzwecken wurde DummyData gespeichert")
      alert("Woops falscher QR-Code, zu Testzwecken wurde DummyData gespeichert");
      this.testDummyData()
      return false
    })
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is used to add the Title and Full Description of the Medication
  /* In the QR-Code of the eMediplan only the Pharmacode of the Medication is stored
  /* To get the description a Call to the HCI Solutions Database is needed
  /*
  /* Returns a list of Promises, because multiple accesses to the Database is needed!
  /*----------------------------------------------------------------------------*/
  IdHCIQuery(medData){
    this.list = new Array<any>();
    var hciS = new HCIService();
    for (let medi of medData['Medicaments']){
      if(Number(medi.Id)){

        var l = hciS.hciquery(medi.Id,"phar").then((responseXML)=>{
          var xml =  responseXML;
          var art = xml.getElementsByTagName("ART");
          var desc = art[0].getElementsByTagName("DSCRD")[0].textContent
          var title = desc.split(" ")[0];
          medi.description = desc
          medi.title = title
        });
      }
      else{
        medi.description = medi.Id
        medi.title = medi.Id
      }
      this.list.push(l)
    }

    return Promise.all(this.list).then((res) => {
      return(medData['Medicaments']);
    });
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is used to add Selfmedication to the Array
  /* The Scan of the Barcode only has the ArticleNumber on it.
  /* To get the full Data of the Medication a call to the HCI Solutions Database
  /* is needed!

  /* Returns a Promise when successfully done.
  /*----------------------------------------------------------------------------*/
  scanMediCode(medData,morning,midday,evening,night,reason):Promise<any>{

    if(morning==true || morning == 'true') morning=1
    else morning = 0
    if(midday==true || midday == 'true') midday=1
    else midday = 0
    if(evening==true || evening == 'true') evening=1
    else evening = 0
    if(night==true || night == 'true') night=1
    else night = 0


    var hciS = new HCIService()
    return BarcodeScanner.scan().then((barcodeData) => {
      return hciS.hciquery(barcodeData.text,"ARTBAR").then(function(response) {
        console.log(response);
        var xml =  response;
        var art = xml.getElementsByTagName("ART");
        var desc = art[0].getElementsByTagName("DSCRD")[0].textContent
        var title = desc.split(" ")[0];
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
        today = yyyy+'-'+mm+'-'+dd;

        var tempObj = ({
          "AppInstr":"Arzt oder Apotheker fragen",
          "TkgRsn":reason,
          "AutoMed":"1",
          "Id":art[0].getElementsByTagName("PHAR")[0].textContent,
          "IdType":"3",
          "Unit":"",
          "description":desc,
          "title":title,
          "PrscbBy":"mir als Patient",
          "Pos":[{
            "D":[
              morning,
              midday,
              evening,
              night
            ],
            "DtFrom":today
          }]
        })
        if(medData==null){
          var newList:any[]
          newList.push(tempObj)
          medData = newList
        }
        else{
          medData.push(tempObj)
        }

        return medData
      })
      }, (err) => {
        console.log(err)
      })
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is used to do all the needed checks for the Medication
  /* At the moment this method only checks for Doping and nutrition
  /* "stringChecks" can be adapted!

  /* Saves the checks in the storage: "checks"
  /*----------------------------------------------------------------------------*/
  doChecksWithCurrentMedication(){
        let grouping:HCITypes.grouping = "byProduct"
        let extent:HCITypes.extent  = 'full';
        let checks=[];
        let stringChecks = [];
        stringChecks.push("doping", "nutrition")

        for (var item of stringChecks) {
          let tempCheck:HCITypes.checkType = item
          let tCheck = {
            check:tempCheck
          } as HCITypes.check
          checks.push(tCheck)
        }

        this.chmedHandler.getCHMEDString().then((chmed16) => {
          console.log(chmed16)
        let medication = chmed16
        let hciCdsCheckRequest = {
           medication: medication,
           extent: extent,
           grouping: grouping,
           checks: checks
        } as HCITypes.hciCdsCheckRequest;

        HciHospAPI.hciCdsCheck(hciCdsCheckRequest).then((res)=>{
          console.log(res)
          this.storage.set("checks", res);
        })
      })
  }

  /*----------------------------------------------------------------------------*/
  // Compare the medicationData stored on the Phone with the
  // MedicationData String from MiDATA!
  /*----------------------------------------------------------------------------*/
  compareCHMED16Date(midataCHMED):any{
    return this.storage.get("mediPlan").then((res) => {
      let actMediplan = new Date(res.Dt.substring(0, 10));
      let midataJson = new Date(this.chmedHandler.analyseCHMED(midataCHMED).Dt.substring(0, 10))
      console.log(actMediplan >= midataJson)

      if(actMediplan >= midataJson){
        console.log("Mediplan von Device")
        return this.chmedHandler.getCHMEDString()
        }
      else{
        console.log("Mediplan midata")
        this.saveMedicationInformation(midataCHMED)
        return midataCHMED
      }
    })
    }

  /*----------------------------------------------------------------------------*/
  /* This method is used to analyse the String, call the Check Functions
  /* and save the Medication Data + create a new ComplianceDataObject!
  /*----------------------------------------------------------------------------*/


  saveMedicationInformation(stringData){
    let strData: string = this.chmedHandler.chmedToString(stringData)
      this.storage.ready().then(() => {
      var mediPlan = JSON.parse(strData)
      this.storage.set("mediPlan", mediPlan).then(()=>{
        this.doChecksWithCurrentMedication()
      });
      this.IdHCIQuery(mediPlan).then((res) => {
         // fails as of today (3.4. hessg1)
          mediPlan['Medicaments'] = res
          this.storage.set("mediPlan", mediPlan);
          this.storage.set("medicationData", res);
          console.log(mediPlan);
	        var tempMedicationData = res;
	        var complianceObj = ({        //new object
	        "ID":"1",
	        "Date":"dateOfMediplan",
	        "DrugList":[]
	        })
	        for(var pos in tempMedicationData){ //new drug obj for every drug in the DrugList
	          complianceObj.DrugList.push({
	            "Name":tempMedicationData[pos].title,
                "Compliance":[]
              })
            }
           this.storage.set('ComplianceData',complianceObj)//save to storage
          })
        });
  }
  /*----------------------------------------------------------------------------*/
  /* This Method is called when the Medication is updated via the CUI.
  /* It builds a connection to Midata with username and password entered.
  /*----------------------------------------------------------------------------*/

  updateMidataFromConversation(username:string, password:string){
    console.log(username, password)
    let midata = new Midata("https://test.midata.coop:9000","eMMA","W1KAS4hxm1Ljd01j78e2ZTeMEzgczz0w");
    //  let uName = "marie@emma.ch"
    //  let uPassword = "Emma1234."

    midata.login(username,password).then((AuthToken)=>{
    console.log(AuthToken)
    midata.search("Device").then((res)=>{
      this.compareCHMED16Date((res[0])).then((newMediplan)=>{
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
        })
      });
    });
  }

  /*----------------------------------------------------------------------------*/
  /* This method is creating a medicationplan with data, it is used for the demo
  /*----------------------------------------------------------------------------*/
  testDummyData(){
    var testData = "CHMED16A1H4sIAAAAAAAAA61UW2+bMBT+K55fC61tIECelsuyRctNCeukTX0wYAIKmAicaU2U/75jKG1XpdnLpFyOfT7b5/vO5YQHB5XiPq7VIRZS1R/DJL2NUmzgsYJtRqhrEsdkfkCdPqN9i94Q1icEANMYAKFtJX4vTEw78ZhpCz80fR56ph+RKPESz+G+C9i5iIPHvcB92thZxAv9Gu7/POHBfj+VtargNsmjFMWiQJ/qWsjuDdv2KbXaJ9tbLAOvyvb0GH6pQQz4PuigJ1VZtIH3TOLDp6ESlK/2qI/PgF1VdRQOH8Exrm7RolRoUnF5NPTfQchE5DGcXZccEKslmMFuu64lrKbg3Kms1BF+k5kWahN8hUUs6qjK9o2rj4eDUbCezlFSVkqggIc58gi5oz1SbBElaKN2cEZlKhcvaHw2Ti1t5lFi9ezrtMkl2pZJ6AWKg+qo0BcuawPNgWCUCpnyQyv0JZrDHGqjjNK4OkS761RHS3M8Xd4PFmiS5YXSVIHmHWW3DgKyzHtD9hn/Qpf6zLXZlSyT97L8n+iO0jIXtRJVJgG0E9V1ypvlOphuXvgyoplab9Pawhqarwo9zGp0PKCC/75FNvzlSB3ENs+g/GlTKUJByYhMSpEWTcTQpyV0TtNBbVe4PYta7jt6XeyDqVyLurkhCFpY2cLI+eFv/dweoYRYjNi+476j1yaC0Kqj+EcXrAaLwXg5Q6+kckijFXur1RO0zSVXGYwI3D/hYTOKqG9bJqU61wYeZUqH+Z3nsRZNHeQWdicLGCuwHWQFrD4LGUMSNd3Zk2NcVrLJ6wzwsPzUjib9yHhWq7nQATd7vNXxeWi1BJmB73kOGI82GW3drHPTzk090pBYR80t0zZta1g4rvvQlTzrDKsz7M5wOqPXHaOQoTPIkpZSM7mxKXJ9RJmFbAf1dI42qhJCKzUU1RbKjMMMRVTPjx/ZHrZ95sPgg/uKneYuKvSkMcpqhX6VBdKTecd13up9ziUKxVZkuiPUB3z+A3b0k/UrBgAA"
    let strData: string = this.chmedHandler.chmedToString(testData)
    var mediPlan = JSON.parse(strData)
    this.storage.set("mediPlan", mediPlan).then(()=>{
      this.storage.set("medicationData", mediPlan['Medicaments']);
      console.log("DummyDataSet")
    })
  }


  /*----------------------------------------------------------------------------*/
  /* This method is used to analyse the String, can be used manually to check a CHMED String
  /*----------------------------------------------------------------------------*/
  analyseCHMED(){
    var testData = "CHMED16A1H4sIAAAAAAAAA61VzXLiOBB+lR5fxxBJNmBzIyHZdQ0ECjyZqt3KQRgBWmyZkuWpmaTyNvMYc8s77XlbVpwwWZK9bBXGbfWP9H39uX3vjWqz84beoE8oIQEjYdwbeL43NrjICO13KOnQKKXRkAbDIPhI2JAQDEjWGLAKg03cX2064SZinVDEq07MV1Enzki2iTZRj8e22FSs0+8H4Q1pY8uMF0KZyhv+ee+NDodEVUZjNcWzHaxFAZdVJVS7RxjGlAZuS1cl8L156bLH+E994uN1aw99pcuiPTiJ8ddAScujNRp7Dxg711W2Ov+OjrHuwnVp4EpzdefbWy3URuRrzF2UHCPmMzTT/XZRKXxK0Lk3srQn/KykJWqZfsKHtagyLQ+Na+idjy7SRTKFTamNgJSvcogIOaN9UmyBEliaPeYYaXLxEu09+PcONosoCfrh+7DJKdhBh9ATEEf6zsDvXFU+TB9/qmwn1I7XjuhTMM9zVEaZ7da6zvbvQ72YdcbJ7GZ0DVcyL4yFijDPKOv2AMGy6BXY5/gXuDRmg5C902XyVpf/J7gXuzIXlRFaKgzaC/0+5OVskSbLF7yMWKTB67a6sAbmsdBrDbJbdH2w1rrWqHtpfbUUVixzoatSCfWhfQcYpVEYvE0OO6mFXodS5OcEOZffeHHIBXziOvfhy+MPtZXPvKAKj2UgdL2T21ptXwiZTv7Fx81oknyeQqL+gsnfldV3sT1jRd7gPJPdr13owag4AIMiPyLI5SFBqs7zX1layQruaij4ty6EeMvBPP7Y5hLJos37JAxyJaRSYlc0fcVZVuJ8aeaMmx2DfkCDwRvEnZwWiVqIqqmQpi6sdGHk4fZXIl+PzFOqWmZ4NH0n/mNWzEfXo/FsAkeC6pFGUey1op5CXVO5kThIveG9d94MbBqHQdN0ihkX0thjfuH52pJmXAuvrnH42jrCNBr/Tag1Ghbw5Mk1rSvnm2AGCubSjXC7zXhSmamwR27WuGPyebg7iMz3bniOMRFtlO/crHXT1k0j0sBYZE2VxDVugQ+9weC2HQ2sNYLWCFuj1xr9No1ijx6QmB2+PrjDx5DCIAbKAgh70LddWhothHHC3qLQOH5rgNo5+4c84HLMYvxAYL1ib7ELDU8sg6wMfC0LsF+wPbedqw45V7ASWyEtY+aD9/APcU6IyFEHAAA="
    var b64Data  =   testData.substring(9);
    // Decode base64 (convert ascii to binary)
    var strData     = atob(b64Data);
    // Convert binary string to character-number array
    var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
    // Turn number array into byte-array
    var binData     = new Uint8Array(charData);
    // Pako magic makeing
    var data        = myPako.inflate(binData);
    // Convert gunzipped byteArray back to ascii string:
    let strData2: string  = String.fromCharCode.apply(null, new Uint16Array(data));
    var mediPlan = JSON.parse(strData2)
    console.log(mediPlan)
  }
}
