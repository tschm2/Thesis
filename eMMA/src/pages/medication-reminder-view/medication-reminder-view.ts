import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { UpdatePage } from '../../pages/update/update';
/*
  Generated class for the MedicationReminderView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-medication-reminder-view',
  templateUrl: 'medication-reminder-view.html'
})
export class MedicationReminderViewPage {
  complianceMedication:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {

  }

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
  changeState(event, pos){
  var target = event.srcElement;
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

  onPop(){
    this.navParams.get('resolve')(this.complianceMedication);
    this.navCtrl.pop();
  }





}
