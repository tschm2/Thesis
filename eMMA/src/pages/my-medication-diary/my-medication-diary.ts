import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the MyMedicationDiary page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-medication-diary',
  templateUrl: 'my-medication-diary.html'
})
export class MyMedicationDiaryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyMedicationDiaryPage');

    var tempObj = ({
      "ID":"1",
      "Date":"dateOfMediplan",
      "DrugList":{
        "NameVonMedikament1":{
          "Dates":[{
            "Date":"27.04.2016",
            "D":[
            0,
            1,
            null,
            null
            ]
          },{
            "Date":"28.04.2016",
            "D":[
            1,
            null,
            1,
            1
            ]
          }]
        },
        "NameVonMedikament2":{
          "Dates":[{
            "Date":"27.04.2016",
            "D":[
            0,
            1,
            null,
            null
            ]
          },{
            "Date":"28.04.2016",
            "D":[
            1,
            null,
            1,
            1
            ]
          }]
        }
      }
    })
    console.log(tempObj);

  }

}
