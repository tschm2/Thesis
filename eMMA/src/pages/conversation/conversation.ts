import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';
import {Content} from 'ionic-angular/index';
import { Storage } from '@ionic/storage';
//Inport conversation methodes
import { eMMA} from '../../pages/conversation/eMMA';
import { questionHandler } from '../../pages/conversation/questionHandler';
//Import other Pages
import { Page1 } from '../../pages/page1/page1';
import { UpdatePage } from '../../pages/update/update';
import { NutritionPage } from '../../pages/nutrition/nutrition';
import { AboutEmmaPage } from '../../pages/about-emma/about-emma';
import { MyMedicationDiaryPage } from '../../pages/my-medication-diary/my-medication-diary';
import { MyMedicationPage } from '../../pages/my-medication/my-medication';
import { MedicationReminderViewPage } from '../../pages/medication-reminder-view/medication-reminder-view';
//Import Services
import { barcodeService } from '../../services/barcodeService';
import { Http, Headers, RequestOptions } from '@angular/http';
import { LocalNotifications } from 'ionic-native';

//Initalize eMMA Waiting Time
var eMMAWaitingTimeShort = 200;
var eMMAWaitingTime = 800;
var eMMAWaitingTimeDouble = 1600;

var notificationSingelton = true;

//Initalize Numbers for Buttons
var showNothing = 0;
var showTextfield = 1;
var showButtons = 2;
var showPasswordField = 4;
var showNumberField = 3

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})

export class ConversationPage {

  @ViewChild(Content)  content: Content;
  messages: any[];
  preAnswers: any[];
  sendButton: String;
  sendButtonPW: String;
  sendButtonNumber: String;
  toggleObject:number;
  notifications: any[] = [];
  returnvaluePatientCompliance:any;

  constructor(public http:Http,public navCtrl: NavController, public navParams: NavParams, private storage:Storage, public platform: Platform, public alertCtrl: AlertController) {
    this.messages = [];
    this.preAnswers = [];
    this.toggleObject = showTextfield;
  }
  eMMA = new eMMA();
  questionhandler = new questionHandler(this.storage);
  ionViewDidLoad() {
    this.toggleObject = showTextfield;
    this.storage.get('FirstStartComplet').then((terminated)=>{
      var FirstStartComplet = terminated;
      if(FirstStartComplet == "reminder"){
        this.reminderAppStart();
      }
      else if(FirstStartComplet == null){
        this.firstAppStart();
      }
      else{
        this.normalAppStart();
      }
     })
  }
  /*****************************************************************************

  Normal App start

  *****************************************************************************/
  firstAppStart() {
     this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Hello_1)
    setTimeout(()=> this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Hello_2),eMMAWaitingTimeDouble);

    this.overrideSendbutton("questionPinNecessary");
  }
  questionPinNecessary(input:String){
    if(input == null){
      this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_NoName);
    }
    else{
      this.storage.set('name', input).then(()=>{
      this.storage.get('name').then((name)=>{
      var tempName = name;
      this.sendEmmaText("Hallo " + tempName+ "\n"+ this.eMMA.messageEMMA_FirstStart_questionPin);
      this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionPin_Yes,"inputPin",this.eMMA.messageEMMA_FirstStart_questionPin_No,"questionAthlete");
    })})
    }
  }
  inputPin(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Pin);
    this.overrideNumberSendButton("questionAthlete");
  }
  questionAthlete(input:String){
    if(input != this.eMMA.messageEMMA_FirstStart_questionPin_No){
       this.storage.set('Pin', input);
    }
    else{
      this.storage.set('Pin', null);
    }
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionAthlete);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionAthlete_Yes,"saveAthlete",this.eMMA.messageEMMA_FirstStart_questionAthlete_No,"saveAthlete");
  }
  saveAthlete(input: String){
    if(input == this.eMMA.messageEMMA_FirstStart_questionAthlete_Yes ){
      this.storage.set('athlete', true)
    }
    else{
      this.storage.set('athlete', false)
    }
    this.questionDriver();
  }
  questionDriver(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionDriver);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionDriver_Yes,"saveDriver",this.eMMA.messageEMMA_FirstStart_questionDriver_No,"saveDriver");
  }
  saveDriver(input:String){
    if(input == this.eMMA.messageEMMA_FirstStart_questionDriver_Yes ){
      this.storage.set('driver', true)
    }
    else {
      this.storage.set('driver', false)
    }
    this.questionMediplan();
  }
  questionMediplan(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImportMediplan);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImportMediplan_Yes,"mediplanImport",this.eMMA.messageEMMA_FirstStart_questionImportMediplan_No,"questionEHealth");
  }
  mediplanImport(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_ImportMediplan_OpenScanner);
    setTimeout(() => {
      let scanner = new barcodeService(this.http, this.storage)
      var success = scanner.scanQRcodeForJSON();
      if(success){
        this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_ImportMediplan_success)
        setTimeout(() => this.questionEHealth() , eMMAWaitingTime);
      }
      else{
        this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_ImportMediplan_Error)
        setTimeout(() => this.questionMediplan() , eMMAWaitingTime);
      }
      //this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_ImportMediplan_sucsess);
      }, 4000);
  }
  questionEHealth(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImporteHealth);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImporteHealth_Yes,"eHealthUsername",this.eMMA.messageEMMA_FirstStart_questionImporteHealth_No,"eMMATourtorial");
  }
  eHealthUsername(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questioneHalthUsername);
    this.overrideSendbutton("eHealthPassword");
  }
  eHealthPassword(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questioneHalthPasword);
    this.overridePasswordSendButton("testUsernamePassword");
  }
  testUsernamePassword(){
    //ifLoginPossible
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_eHealthCorrect)
    setTimeout(() => this.eMMATourtorial(),eMMAWaitingTime);
    //else
    //this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_eHealthWrong);
    //this.eHealthUsername
  }
  eMMATourtorial(){
    this.storage.set('FirstStartComplet', true)
    let tempTakingTime = ["08:00","12:00","18:00","22:00"]
    this.storage.set('takingTime',tempTakingTime)
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Tourtorial);
    this.overrideSendbutton("question");
    this.eMMANewComplianceObj();
  }
  /*****************************************************************************

  Reminder for eMMA

  *****************************************************************************/
  reminderAppStart(){
    this.storage.set('FirstStartComplet', true)
    this.storage.get('Pin').then((Pin)=>{
    var tempPin = Pin;
    if(tempPin == null){
      this.reminderAppStartAfterPin()
    }
    else {
      this.sendEmmaText(this.eMMA.messageEMMA_EnterPassword);
      this.overrideNumberSendButton("checkPin");
    }
  })
  }
  checkPin(input: String){
    this.storage.get('Pin').then((Pin)=>{
    var tempPin = Pin;
    if(input == tempPin){
      this.reminderAppStartAfterPin()
    }
    else {
      this.sendEmmaText(this.eMMA.messageEMMA_WrongPin)
    }
  })
  }
  reminderAppStartAfterPin(){
    this.storage.get('name').then((name)=>{
    var Name = name;
    var myDate = new Date()
    let myHours = myDate.getUTCHours()+2
    let myMinute = myDate.getUTCMinutes()
    let time = myHours + ":"+ myMinute;
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_questionAll_1 + Name + this.eMMA.messageEMMA_reminderAppStart_questionAll_2 + time +this.eMMA.messageEMMA_reminderAppStart_questionAll_3);
    this.overrideAnswerButtonsOneButton(this.eMMA.messageEMMA_reminderAppStart_showMedication,"AwnswerReminder")
  })
  }
  AwnswerReminder(){
    LocalNotifications.getTriggered(1).then((res)=>{
      let dayTime = res["0"].data;
      setTimeout(() =>   new Promise((resolve, reject) => {
        this.navCtrl.push(MedicationReminderViewPage,
          {state: dayTime, resolve: resolve});
        }).then(data => {
          this.returnvaluePatientCompliance=data;
          console.log(data);
          this.returnFromMedication()
        }),eMMAWaitingTimeDouble);
    })
  }
  finishReminder(input:String){
    if(input != ""){
      this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_finishNachBedarf);
    }else{
      this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_finish);
    }
    this.addComplianceInformation("1");
    this.overrideSendbutton("question");
  }
  returnFromMedication(){
    let medicationNotTaken = "";
    let finishReminder = true;
    for(let pos in this.returnvaluePatientCompliance){
      if(this.returnvaluePatientCompliance[pos].taken == 0){
        if(this.returnvaluePatientCompliance[pos].dosage == "nach Bedarf"){
          medicationNotTaken = medicationNotTaken + "Medikament nach Bedarf;\n" + this.returnvaluePatientCompliance[pos].title + "\n"
        }
        else{
        medicationNotTaken = medicationNotTaken +  this.returnvaluePatientCompliance[pos].title + "\n"
        finishReminder = false
        }
      }
    }
    if(finishReminder){
      this.finishReminder(medicationNotTaken);
    }else{
      this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_1 + "\n" + medicationNotTaken + this.eMMA.messageEMMA_reminderAppStart_why_2)
      this.overrideAnswerButtons(this.eMMA.messageEMMA_reminderAppStart_why_Note,"leaveNote",this.eMMA.messageEMMA_reminderAppStart_why_notSpecified,"finishReminderNotSpecified")
    }
  }
  leaveNote(){
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_LeaveNote);
    this.overrideSendbutton("finishReminderNote");
  }
  finishReminderNote(input:String){
    //Save Note to Compliance
    this.addComplianceInformation(input);
    this.finishReminder("");
  }
  finishReminderNotSpecified(input:String){
    //Save not specified to Compliance
    this.addComplianceInformation("0");
    this.finishReminder("");
  }
  /*****************************************************************************

  Question for eMMA

  *****************************************************************************/
  normalAppStart() {
    this.storage.get('name').then((name)=>{
    var Name = name;
    this.sendEmmaText(this.eMMA.messageEMMA_Normal_Start_1 + Name + this.eMMA.messageEMMA_Normal_Start_2);
    this.overrideSendbutton("question");
  })
  }
  question(input:String){
    this.questionhandler.returnAnswer(input).then((res)=>{
      var answereMMA:String = res
      this.sendEmmaText(answereMMA)
      setTimeout(() => {
        var myDate = new Date();
        var myHour: Number = myDate.getUTCHours()+2
        var myMinute: Number = myDate.getUTCMinutes()
        if(answereMMA == this.questionhandler.messageEMMA_Reminder_Morning){
          this.addlocalnotification(myHour,myMinute,0)
        }
        else if(answereMMA == this.questionhandler.messageEMMA_Reminder_Midday){
          this.addlocalnotification(myHour,myMinute,1)
        }
        else if(answereMMA == this.questionhandler.messageEMMA_Reminder_Evening){
          this.addlocalnotification(myHour,myMinute,2)
        }
        else if(answereMMA == this.questionhandler.messageEMMA_Reminder_Night){
          this.addlocalnotification(myHour,myMinute,3)
        }
        else if(answereMMA == this.questionhandler.messageEMMA_Delete_Storage){
          this.storage.clear();
          this.content.resize();
        }
        else if(answereMMA == this.questionhandler.messageEMMA_Nutrition){

          this.navCtrl.push(NutritionPage)
        }
        else if(answereMMA == this.questionhandler.messageEMMA_Compliance){
          this.navCtrl.push(MyMedicationDiaryPage)
        }
        else if(answereMMA == this.questionhandler.messageEMMA_Selfmedication){
          this.navCtrl.push(MyMedicationPage)
        }
        else if(answereMMA == this.questionhandler.messageEMMA_About){
          this.navCtrl.push(AboutEmmaPage)
        }
      }
      ,eMMAWaitingTimeDouble);
    });

  }
  /*****************************************************************************

  Funtions for Conversation.ts

  *****************************************************************************/
  eMMANewComplianceObj(){
    this.storage.ready().then(()=>{
      this.storage.get('medicationData').then((res)=>{
      var tempMedicationData = res;
      console.log(tempMedicationData)
      var complianceObj = ({
      "ID":"1",
      "Date":"dateOfMediplan",
      "DrugList":[]
      })
      for(var pos in tempMedicationData){
        complianceObj.DrugList.push({
          "Name":tempMedicationData[pos].title,
          "Compliance":[]
        })
      }
     this.storage.set('ComplianceData',complianceObj)
    })
  })
  }
  sendEmmaText(message:String){
    //Püntkli azeige
    var myDate = new Date();
    var myHour: Number = myDate.getUTCHours()+2
    var myMinute: Number = myDate.getUTCMinutes()

    this.messages.push({
        text: 'eMMA schreibt....',
        identity: 'emma',
        time: myHour + ":"+myMinute
      }),
      this.content.scrollToBottom(),
      setTimeout(() => this.messages[this.messages.length-1].text = message, eMMAWaitingTime),
      setTimeout(()=> this.content.scrollToBottom(),eMMAWaitingTime+50)
  }
  overrideAnswerButtons(text1: String, function1: String, text2: String, function2: String) {
    this.toggleObject = showNothing;
    setTimeout(() => this.toggleObject = showButtons , eMMAWaitingTime);
    this.preAnswers = []
      for (let i = 1; i <= 2; i++) {
        this.preAnswers.push({
          text: eval("text" + i),
          id: i,
          callFunction: eval("function" + i)
        })
      }
  }
  overrideAnswerButtonsOneButton(text1: String, function1: String) {
    this.toggleObject = showNothing;
    setTimeout(() => this.toggleObject = showButtons , eMMAWaitingTime);
    this.preAnswers = [];
    this.preAnswers.push({
      text: text1,
      id: 1,
      callFunction: function1
    })
  }
  overrideSendbutton(newfunction:String){
    this.toggleObject = showNothing;
    setTimeout(() => this.toggleObject = showTextfield,eMMAWaitingTime);
    this.sendButton = newfunction;
  }
  overridePasswordSendButton(newfunction:String){
    this.toggleObject = showNothing;
    setTimeout(() => this.toggleObject = showPasswordField,eMMAWaitingTime);
    this.sendButtonPW = newfunction;
  }
  overrideNumberSendButton(newfunction:String){
    this.toggleObject = showNothing;
    setTimeout(() => this.toggleObject = showNumberField,eMMAWaitingTime);
    this.sendButtonNumber = newfunction;
  }
  reply(answer) {
    var myHour: Number = (new Date().getUTCHours()+2)
    var myMinute: Number = new Date().getUTCMinutes()
    this.messages.push({
      text: answer.text,
      identity: 'user',
      time: myHour + ":"+myMinute
    })
    this[answer.callFunction](answer.text);
    setTimeout(() =>{  this.content.scrollToBottom();},50);
    }
  sendMessage(myReply, myFunc) {
    var myHour: Number = (new Date().getUTCHours()+2)
    var myMinute: Number = new Date().getUTCMinutes()
    this.messages.push({
      text: myReply.value,
      identity: 'user',
      time: myHour + ":"+myMinute
    })
    this[myFunc](myReply.value);
    myReply.value = "";
    setTimeout(() =>{ this.content.scrollToBottom();}, 50);
  }
  addComplianceInformation(information:String){
    let compliance;
    if(information = "0"){
      compliance = 0;
    }else{
      compliance = information;
    }

    LocalNotifications.getTriggered(1).then((res)=>{
      let dayTime = res["0"].data;
      var complianceObj;
      this.storage.ready().then(()=>{
        this.storage.get('ComplianceData').then((res)=>{
          complianceObj = res;
          //Add Date
          let todayDate:any = new Date();
          let actualYear = todayDate.getFullYear();
          let actualMonth;
          let actualDay;
          //Add Month
          if(todayDate.getMonth() < 10){
            actualMonth = "0" + (todayDate.getMonth() + 1);
          }else{
            actualMonth = (todayDate.getMonth() + 1);
          }
          //Add Day
          if(todayDate.getDate() < 10){
            actualDay = "0" + todayDate.getDate();
          }else{
            actualDay = todayDate.getDate()
          }
          //Create time format for today
          let complianceDate = actualDay + "." + actualMonth +"."+actualYear;
          for(let pos in this.returnvaluePatientCompliance){
            for(var posComliance in complianceObj.DrugList){
              if(complianceObj.DrugList[posComliance].Name == this.returnvaluePatientCompliance[pos].title){

                let posOfLastEntry = complianceObj.DrugList[posComliance].Compliance.length
                console.log(complianceDate);
                //console.log(complianceObj.DrugList[posComliance].Compliance[posOfLastEntry].Date);

                if(complianceObj.DrugList[posComliance].Compliance[posOfLastEntry] && complianceObj.DrugList[posComliance].Compliance[posOfLastEntry].Date == complianceDate){
                }
                //if there is no existing compliance OBJ at the Actual Day
                else{
                  complianceObj.DrugList[posComliance].Compliance.push({
                  "Date": complianceDate,
                  "D":[
                    undefined,
                    undefined,
                    undefined,
                    undefined
                    ]
                  })
                }
                if(this.returnvaluePatientCompliance[pos].taken == 0){
                  complianceObj.DrugList[posComliance].Compliance[posOfLastEntry].D[dayTime] = compliance;
                }else{
                  complianceObj.DrugList[posComliance].Compliance[posOfLastEntry].D[dayTime] = 1;
                }
              }
            }
          }
          this.storage.set('ComplianceData',complianceObj)
          console.log(complianceObj)
        })
      })
    });
  }
  addlocalnotification(hours:any,minutes:any,timeOfDay:any){
    let firstNotificationTime  = new Date()
    firstNotificationTime.setHours(hours)
    LocalNotifications.clearAll()
    firstNotificationTime.setMinutes(minutes)
      let notification = {
          id: 1,
          title: 'eMMA hat dir geschrieben',
          text: 'Es ist jetzt dr tim muess no dr storage usläse',
          data: timeOfDay,
          at: firstNotificationTime,
      };
    if(this.platform.is('cordova')){
        // Cancel any existing notifications
        LocalNotifications.cancelAll().then(() => {
          // Schedule the new notifications
          LocalNotifications.schedule(notification);
          let alert = this.alertCtrl.create({
              title: 'Notifications set\n'+ hours +":" + minutes + "Uhr",
              buttons: ['Ok']
          });
          alert.present();
        });
      }
      if(notificationSingelton){
        notificationSingelton = false;
        this.triggerNotification()
      }
  }
  triggerNotification(){
    LocalNotifications.on("trigger", (event)=>{
       var myDate = new Date();
       var myHour: Number = myDate.getUTCHours()+2
       var myMinute: Number = myDate.getUTCMinutes()+1

      this.storage.set('FirstStartComplet', "reminder")
      console.log("triggered")
      console.log(event.data)
      let id = event.data
      if(id== 4){
        id = 0
      }
      id++
      this.content.resize();
      //setTimeout(()=> this.addlocalnotification(myHour,myMinute,id),4000)
    })
  }
}
