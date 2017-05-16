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
  months = ["Januar", "Februar", "März", "April", "Mai" , "Juni" , "Juli", "August" ,"September", "Oktober", "November" , "Dezember"]
  takenStrings = ["Morgen","Mittag","Abend","Nacht"]
  barChart: any;
  lineChart: any;
  ComplianceListDescription:any;
  toggleObject:number;
  choosenDrug: any = "Gesamte Medikation";


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
      for (var posDrug in complianceObj.DrugList)
      {
        // for(var m = 1; m<=6;m++){
        //   for(var i = 1; i<2;i++){
        //     complianceObj.DrugList[posDrug].Compliance.push({
        //     "Date": i+".0" + m +".2017",
        //     "D":[
        //       Math.round(Math.random()),
        //       Math.round(Math.random()),
        //       Math.round(Math.random()),
        //       "Niiiiicht eingenommen"
        //       ]
        //     })
        //   }
        // }
        tempMonthObj.DrugList.push({
          "Name": complianceObj.DrugList[posDrug].Name,
          "Months":[]
        })
        for(var pos in this.months){
         tempMonthObj.DrugList[posDrug].Months.push({
           "Name": this.months[pos],"Values":[0,0]
         })
        }
      }
      console.log("Dummy daten erstellt", tempMonthObj)

      let labelNames = new Array<any>()
      var barValues = new Array<any>()

      for(var pos in complianceObj.DrugList){
          labelNames[pos] =   complianceObj.DrugList[pos].Name;
          let tempMax = 0;
          let temptaken = 0;
          for(var value in complianceObj.DrugList[pos].Compliance){

          //this part analyses the Compliance data and fill the correct values in the monts and drugcompliance array
          let ArryValue = Number( complianceObj.DrugList[pos].Compliance[value].Date.substring(3,5));
            for(var taken in complianceObj.DrugList[pos].Compliance[value].D){
              if(complianceObj.DrugList[pos].Compliance[value].D[taken] != undefined){
                tempMax++;                                                    //add one value for a medication who should be taken
                  tempMonthObj.DrugList[pos].Months[ArryValue-1].Values[0]++  //add one tho acutal month, for a medication which should be taken
                if(complianceObj.DrugList[pos].Compliance[value].D[taken] != 0){
                    tempMonthObj.DrugList[pos].Months[ArryValue-1].Values[1]++  //add one tho acutal month, which was taken
                  temptaken++;                                                  //add one value for a medication which was taken
                  if(complianceObj.DrugList[pos].Compliance[value].D[taken] != 1){
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
          }
          //add compliance dectiption for show all detail compliance informatoion in the table
          this.ComplianceListDescription.push({
            data: messages,
            name: labelNames[pos]
          })
          messages = [];
        barValues[pos] = temptaken/tempMax * 100;
      }
      //take the months array and fill the array with values for the line chart
      var monthvalues = new Array<any>()
      for(var drugpos in tempMonthObj.DrugList){
        if(tempMonthObj.DrugList[drugpos].Name == this.choosenDrug||this.choosenDrug == null||this.choosenDrug == "Gesamte Medikation"){
          for (var pos in tempMonthObj.DrugList[0].Months){
            if(tempMonthObj.DrugList[0].Months[pos].Values[0] == 0){
              monthvalues.push(null)
            }else{
              monthvalues.push(tempMonthObj.DrugList[0].Months[pos].Values[1]/tempMonthObj.DrugList[0].Months[pos].Values[0]*100)
            }
          }
        }
      }
      barValues.push(0,100)
      monthvalues.push(0,100)
      //generate bar chart
      this.barChart = new Chart(this.barCanvas.nativeElement, {
              type: 'bar',
              data: {

                  labels: labelNames,
                  datasets: [{
                      data: barValues,
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
                  scales: {
                      yAxes: [{
                          ticks: {
                              beginAtZero:true
                          }
                      }]
                  }
              }

          });
//generate line chart
          this.lineChart = new Chart(this.lineCanvas.nativeElement, {

              type: 'line',
              data: {
                  labels: this.months,
                  datasets: [
                      {
                          label: "My First dataset",
                          fill: false,
                          lineTension: 0.1,
                          backgroundColor: "rgba(75,192,192,0.4)",
                          borderColor: "rgba(75,192,192,1)",
                          borderCapStyle: 'butt',
                          borderDash: [],
                          borderDashOffset: 0.0,
                          borderJoinStyle: 'miter',
                          pointBorderColor: "rgba(75,192,192,1)",
                          pointBackgroundColor: "#fff",
                          pointBorderWidth: 1,
                          pointHoverRadius: 5,
                          pointHoverBackgroundColor: "rgba(75,192,192,1)",
                          pointHoverBorderColor: "rgba(220,220,220,1)",
                          pointHoverBorderWidth: 2,
                          pointRadius: 1,
                          pointHitRadius: 10,
                          data: monthvalues,
                          spanGaps: false,
                      }
                  ]
              }

          });

      })
    })

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
      let actionSheet = this.actionSheetCtrl.create({
       title: 'Wähle ein Medikament aus',
     });
     var allButton = {
         text: "Gesamte Medikation",
         handler: () => {
           this.choosenDrug = "Gesamte Medikation"
           this.ionViewDidLoad()
         }
       }
    actionSheet.addButton(allButton)
     for (var posDrug in complianceObj.DrugList){
       let tempName = complianceObj.DrugList[posDrug].Name;
      var button = {
          text: tempName,
          handler: () => {
            this.choosenDrug = tempName;
            this.ionViewDidLoad()
          }
        }
       actionSheet.addButton(button)
     }
     actionSheet.present();
   })
 }
}
