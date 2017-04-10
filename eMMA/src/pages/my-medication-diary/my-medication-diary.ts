import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { Component, ViewChild } from '@angular/core';

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

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  months = ["Januar", "Februar", "März", "April", "Mai" , "Juni" , "Juli", "August" ,"September", "Oktober", "November" , "Dezember"]
  drugs = ["Sortis", "Davalgan"]
  barChart: any;
  lineChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyMedicationDiaryPage');
    var tempMonthObj = ({
      "DrugList":[]
    })

    for (var drug in this.drugs)
    {
      tempMonthObj.DrugList.push({
        "Name":this.drugs[drug],
        "Months":[]
      })
      for(var pos in this.months){
       tempMonthObj.DrugList[drug].Months.push({
         "Name": this.months[pos],"Values":[0,0]
       })
      }
    }

    var tempObj = ({
      "ID":"1",
      "Date":"dateOfMediplan",
      "DrugList":[{
          "Name":"Davalgan",
          "Compliance":[{
            "Date":"27.03.2016",
            "D":[
            0,
            1,
            undefined,
            undefined
            ]
          },{
            "Date":"28.03.2016",
            "D":[
            0,
            1,
            undefined,
            undefined
            ]
          },{
            "Date":"29.03.2016",
            "D":[
            0,
            1,
            undefined,
            undefined
            ]
          },{
            "Date":"30.03.2016",
            "D":[
            0,
            1,
            undefined,
            undefined
            ]
          },{
            "Date":"31.03.2016",
            "D":[
            0,
            1,
            undefined,
            undefined
            ]
          },{
            "Date":"01.04.2016",
            "D":[
            0,
            1,
            undefined,
            undefined
            ]
          }
        ]
      },{
          "Name":"SORTIS",
          "Compliance":[{
            "Date":"27.04.2016",
            "D":[
            0,
            0,
            undefined,
            undefined
            ]
          },{
            "Date":"28.04.2016",
            "D":[
            0,
            1,
            undefined,
            undefined
            ]
          }]
      }
    ]
    })

    let labelNames = new Array<any>()
    var Values = new Array<any>()

    for(var pos in tempObj.DrugList){
        labelNames[pos] =   tempObj.DrugList[pos].Name;
        let tempMax = 0;
        let temptaken = 0;
        for(var value in tempObj.DrugList[pos].Compliance){

        let ArryValue = Number( tempObj.DrugList[pos].Compliance[value].Date.substring(3,5));
          for(var taken in tempObj.DrugList[pos].Compliance[value].D){
            if(tempObj.DrugList[pos].Compliance[value].D[taken] != undefined){
              tempMax++;
              tempMonthObj.DrugList[pos].Months[ArryValue-1].Values[0]++
              if(tempObj.DrugList[pos].Compliance[value].D[taken] == 1){
                tempMonthObj.DrugList[pos].Months[ArryValue-1].Values[1]++
                temptaken++;
              }
            }
          }
        }
      Values[pos] = temptaken/tempMax * 100;
      console.log(tempObj);
      console.log(tempMonthObj)

    }
    Values.push(100)

    this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'bar',
            data: {

                labels: labelNames,
                datasets: [{
                    data: Values,
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

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: ["March", "April"],
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
                        data: [65, 59, 100 , 0],
                        spanGaps: false,
                    }
                ]
            }

        });
  }

}
