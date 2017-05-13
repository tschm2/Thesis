import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'
/*----------------------------------------------------------------------------*/
/* MedicationReminderView
/* tschm2
/* This is the TypescriptFile of the MedicationReminderView Page
/*
/* changeState() used to set the MedicationStatusTaken to 1 or 0
/* onPop() If Page is Popped from Navigation Stack reslove Promise
/*----------------------------------------------------------------------------*/

@Component({
  selector: 'page-medication-reminder-view',
  templateUrl: 'medication-reminder-view.html'
})
export class MedicationReminderViewPage {
  /* Array for the Medication */
  complianceMedication:any;
  /**
     * get nutrition detail list from storage and create the nutrition list
     * @param  {Storage}               publicstorage        ionic storage from phone
     * @param  {NavController}         publicNavController  handels the Navigation
     * @param  {NavParams}             publicnavParams      Navigation Parameters
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) { }

  /*----------------------------------------------------------------------------*/
  /* This Method is called as soon the View loads!
  /* It gets the Medication from the Storage, checks which Medication
  /* has to be taken at the current Time of the reminder
  /*----------------------------------------------------------------------------*/
  ionViewDidLoad() {
    this.storage.ready().then(()=>{
      this.storage.get('medicationData').then((res)=>{
        var magicN = this.navParams.get("state");
        var tempList = new Array();
        for(var i = 0; i < res.length; i++) {
          try {
            if(res[i].Pos[0].D[magicN] != 0){
              var dosage = res[i].Pos[0].D[magicN]
              var tempObj = ({
              "Id":res[i].Id,
              "title":res[i].title,
              "unit":res[i].Unit,
              "dosage":dosage,
              "taken":1,
              "position":tempList.length
            })
            tempList.push(tempObj)
            this.complianceMedication = tempList;
            }
          }
          // If Medication has no actual number and is only Taken by Need!
          catch(e){
            dosage = "nach Bedarf"
            var tempObj2 = ({
            "Id":res[i].Id,
            "title":res[i].title,
            "dosage":dosage,
            "taken":0,
            "position":tempList.length
          })
          tempList.push(tempObj2)
          this.complianceMedication = tempList;
          }
        }
      })
    })
  }
  
  /*----------------------------------------------------------------------------*/
  /* This Method is called when the User presses on the Medication
  /* It sets the State of the chosen Medication to 0 or 1
  /* 0 = not Taken, 1 = taken
  /*----------------------------------------------------------------------------*/
  changeState(pos){
    var target = document.getElementById(pos)
    if(target.classList.contains("status1")){
      target.classList.remove("status1")
      target.classList.add("status0")
      this.complianceMedication[pos].taken = 0
    }
    else{
      target.classList.remove("status0")
      target.classList.add("status1")
      this.complianceMedication[pos].taken = 1
    }
  console.log(this.complianceMedication);
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is called when the Pages gets removed from the Navigation Stack
  /* It sets the @param resolve of the Promise to the CurrentComplianceList
  /*----------------------------------------------------------------------------*/
  onPop(){
    this.navParams.get('resolve')(this.complianceMedication);
    this.navCtrl.pop();
  }
}
