import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HciHospAPI } from 'hci-hospindex-api';
import  * as  HCITypes from 'hci-hospindex-api/src/api';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';

/*----------------------------------------------------------------------------*/
/* NutritionPage
/* tschm2, dornt1
/* This is the TypescriptFile of the NutritionPage
/*
/* makeNutritionObject() used to create the NutritionObject for the Page
/*
/*----------------------------------------------------------------------------*/

@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html',

})
export class NutritionPage {
  /* Array for the Medication JSON */
  drugList:any;
  /* Array for the different Checks */
  checkList:any;
  /* isUsed to check if interactions are There
     if no interactions are present the Elements will not get shown on the UI
  */
  checkStatus:any = {
    dRem: <string> null,
    dRlv: <string> null,
    nRem: <string> null,
    nRlv: <string> null,
  }

    /**
       * get nutrition detail list from storage and create the nutrition list
       * @param  {Storage}               publicstorage    ionic storage from phone
       * @param  {AlertController}       publicalertCtrl  handle alerts
     */
  constructor(public http:Http, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public storage:Storage) {}

  /*----------------------------------------------------------------------------*/
  /* This Method is called as soon the View loads!
  /* It creates the NutritionObject
  /*----------------------------------------------------------------------------*/
  ionViewDidLoad() {
    console.log(this.checkStatus)
    this.storage.get('checks').then((res)=>{
      console.log(res)
      this.makeNutritionObject(res);
  });
  }

  /*----------------------------------------------------------------------------*/
  /* This Method creates the NutritionObject for the DOM
  /* @param checks  the Checks Object stored in the Storage!
  /*----------------------------------------------------------------------------*/
  makeNutritionObject(checks){
    this.storage.get('medicationData').then((medData)=>{
      // Check if there are current Interactions with the current medication
      var tempCheck = checks.body.checks
      this.checkStatus.nRem = tempCheck[1].rem
      this.checkStatus.nRlv = tempCheck[1].rlv
      if(tempCheck[0].rlv != 99){
        this.checkStatus.dRlv = tempCheck[0].rlv
        this.checkStatus.dRem = tempCheck[0].rem
      }
      console.log(this.checkStatus)
      checks = checks.body.medicaments
      this.drugList = medData;
      console.log(checks)
      console.log(this.drugList)
      this.checkList = [];
      // Creates an Object for each Check of each Medication
      checks.forEach((item,index) => {
        var drug = {
          name: <string> null,
          doping: <string> null,
          nutrition: <string> null,
          nFull: <string> null,
          nRelevance: <boolean> null,
          dRelevance: <boolean> null,
          nInfo: <string> null
        }
        drug.name = this.drugList[index].title;
        drug.doping = item.checks["0"].rem
        var tempString = item.checks["1"].rem
        if(item.checks["0"].rlv == 99){
          drug.dRelevance = false
        }
        else{
          drug.dRelevance = true
        }

        if(tempString.search(" - ") == -1){
          drug.nutrition = item.checks["1"].rem
          drug.nRelevance = false;
        }
        else{
          drug.nutrition = tempString.slice(tempString.indexOf(" - ")+3)
          drug.nFull = drug.nutrition.slice(drug.nutrition.indexOf(",")+1)
          drug.nutrition = drug.nutrition.slice(0,drug.nutrition.indexOf(","))
          console.log(drug.nutrition)
          drug.nRelevance = true;
        }
        this.checkList.push(drug)
      })
      console.log(this.checkList)
      })
  }

  /*----------------------------------------------------------------------------*/
  /* Shows the Detail Information about the Nutrition
  /* @param index The Index of the entry in the checkList
  /*----------------------------------------------------------------------------*/
  showDetails(index){
    let alert = this.alertCtrl.create({
    title: 'Informationen zu '+this.checkList[index].name,
    subTitle: this.checkList[index].nFull,
    buttons: ['Ok']
    });
    alert.present();

  }
}
