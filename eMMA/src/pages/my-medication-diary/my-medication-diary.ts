import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage'
import { ActionSheetController } from 'ionic-angular';
/*----------------------------------------------------------------------------*/
/* my Medication diary Page
/* tschm2, dornt1
/* This file creates the medication diary
/*
/*
/*----------------------------------------------------------------------------*/
@Component({
  selector: 'page-my-medication-diary',
  templateUrl: 'my-medication-diary.html'
})
export class MyMedicationDiaryPage {

  //view Child for barchart and linechart
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  //dom Obj
  months = ["Januar", "Februar", "März", "April", "Mai" , "Juni"]
  takenStrings = ["Morgen","Mittag","Abend","Nacht"]
  barChart: any;
  lineChart: any;
  ComplianceListDescription:any;
  toggleObject:number;
  choosenMonth: any = "Gesamte Zeitdauer";

  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: Storage,public actionSheetCtrl: ActionSheetController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyMedicationDiaryPage');


    this.ComplianceListDescription = [];
    var complianceObj;
    let messages = [];

    this.storage.ready().then(()=>{
      this.storage.get('ComplianceData').then((res)=>{
      complianceObj = res;

      var tempMonthObj = ({
        "DrugList":[]
      })
      // for (var posDrug in complianceObj.DrugList)
      // {
      //   for(var m = 1; m<=6;m++){
      //     for(var i = 1; i<5;i++){
      //       complianceObj.DrugList[posDrug].Compliance.push({
      //       "Date": "0"+i+".0" + m +".2017",
      //       "D":[
      //         Math.round(Math.random()),
      //         Math.round(Math.random()),
      //         Math.round(Math.random()),
      //         Math.round(Math.random())
      //         ]
      //       })
      //     }
      //   }
      // }
        console.log(complianceObj)
        this.storage.set('ComplianceData',complianceObj)
      let labelNames = new Array<any>()
      var barValues = new Array<any>()

      for(var pos in complianceObj.DrugList){
          labelNames[pos] =   complianceObj.DrugList[pos].Name;
          let tempMax = 0;
          let temptaken = 0;
          for(var value in complianceObj.DrugList[pos].Compliance){

          //this part analyses the Compliance data and fill the correct values in the monts and drugcompliance array
          let monthValue = Number( complianceObj.DrugList[pos].Compliance[value].Date.substring(3,5));
            for(var taken in complianceObj.DrugList[pos].Compliance[value].D){
              if(complianceObj.DrugList[pos].Compliance[value].D[taken] != undefined){
                if(this.months[monthValue-1] == this.choosenMonth||this.choosenMonth == "Gesamte Zeitdauer"){
                  tempMax++;  //add one value for a medication who should be taken
                }
                if(complianceObj.DrugList[pos].Compliance[value].D[taken] == 1){
                  if(this.months[monthValue-1] == this.choosenMonth||this.choosenMonth == "Gesamte Zeitdauer"){
                    temptaken++;      //add one value for a medication which was taken
                  }
                }
                  else{
                        //push deatil information in variable message
                        messages.push({
                        date: complianceObj.DrugList[pos].Compliance[value].Date,
                        dayTime: this.takenStrings[taken],
                        description: complianceObj.DrugList[pos].Compliance[value].D[taken]
                      })
                  }

              }
            }
          }
          //add compliance dectiption for show all detail compliance informatoion in the table
          this.ComplianceListDescription.push({
            data: messages,
            name: labelNames[pos]
          })
          messages = [];
        barValues[pos] = temptaken/tempMax * 100;
      }
      console.log(this.ComplianceListDescription)
      //take the months array and fill the array with values for the line chart
      barValues.push(0,100)
      console.log(barValues)
      //generate bar chart
      this.barChart = new Chart(this.barCanvas.nativeElement, {
              type: 'bar',
              data: {

                  labels: labelNames,
                  datasets: [{
                      data: barValues,
                      label:"Medikationsübersicht",
                      backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)'
                      ],
                      borderColor: [
                          'rgba(255,99,132,1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)'
                      ],
                      borderWidth: 1
                  }]
              },
              options: {
                  tooltipTitleFontSize: 0,
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true
                          }
                      }]
                  }
              }
          });
          this.barChart.options.legend.display = false;
      })
    })
    console.log(this.barChart)
  }


  toggleContent(numb){
    if (this.toggleObject == numb)
      this.toggleObject = 0
    else
      this.toggleObject = numb;
  }
  presentActionSheet() {
    this.storage.get('ComplianceData').then((res)=>{
      let complianceObj = res;
      console.log(res)
      let actionSheet = this.actionSheetCtrl.create({
       title: 'Wähle einen Monat aus',
     });
     var allButton = {
         text: "Gesamte Zeitdauer",
         handler: () => {
           this.choosenMonth = "Gesamte Zeitdauer"
           this.ionViewDidLoad()
         }
       }
    actionSheet.addButton(allButton)
     for (var month in this.months){

      let tempName = this.months[month]
      var button = {
          text: tempName,
          handler: () => {
            this.choosenMonth = tempName;
            this.ionViewDidLoad()
          }
        }
       actionSheet.addButton(button)
     }
     actionSheet.present();
   })
 }
}
