import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';
import {Content} from 'ionic-angular/index';
import { Storage } from '@ionic/storage';
//Import conversation methodes
import { eMMA} from '../../pages/conversation/eMMA';
import { questionHandler } from '../../pages/conversation/questionHandler';
//Import other Pages
import { NutritionPage } from '../../pages/nutrition/nutrition';
import { AboutEmmaPage } from '../../pages/about-emma/about-emma';
import { MyMedicationDiaryPage } from '../../pages/my-medication-diary/my-medication-diary';
import { MyMedicationPage } from '../../pages/my-medication/my-medication';
import { MedicationReminderViewPage } from '../../pages/medication-reminder-view/medication-reminder-view';
//Import Services
import { barcodeService } from '../../services/barcodeService';
import { LocalNotifications } from 'ionic-native';
import { chmedJsonHandler } from '../../services/chmedJsonHandler';

import { BotService } from '../../services/botService';


//Initalize eMMA Waiting Time
var eMMAWaitingTime = 1000;
var eMMAWaitingTimeDouble = 2*eMMAWaitingTime;

var notificationSingelton = true;

//Initalize Numbers for Buttons
var showNothing = 0;
var showTextfield = 1;
var showButtons = 2;
var showPasswordField = 4;
var showNumberField = 3
var showsingleButton = 5;

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html',
  providers: [BotService]
})

export class ConversationPage {

  @ViewChild(Content)  content: Content;
  messages: any[];
  chatlog: any[];
  preAnswers: any[];
  sendButton: string;
  sendButtonPW: string;
  sendButtonNumber: string;
  toggleObject:number;
  notifications: any[] = [];
  chmedHandler: chmedJsonHandler;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, private botService:BotService, public platform: Platform, public alertCtrl: AlertController) {
    this.messages = [];
    this.storage.get('chatlog').then((savedlog)=>{
      this.chatlog = savedlog;
      console.log("log loaded from storage");
    })
    if(this.chatlog == null){
      this.chatlog = [{text: "", identity: "system: init log", time: this.getLocalTime()}];
      this.storage.set('chatlog', this.chatlog).then(()=>{
        console.log("new chatlog saved to storage")
      });
    }
    this.chatlog.push({text: '##new session', identity: 'system', time: this.getLocalTime()});

    this.preAnswers = [];
    this.toggleObject = showTextfield;
    this.chmedHandler = new chmedJsonHandler(this.storage);
	this.botService.init();
  }
  eMMA = new eMMA();
  questionhandler = new questionHandler(this.storage, this.botService);
  /*----------------------------------------------------------------------------*/
  /* This Method is called as soon the View loads!
  /* if handels the state of the application on the conversation view
  /* check in the sotrage if it is a firstStart of the application, a Normal start or a reminder start
  /*----------------------------------------------------------------------------*/
  ionViewDidLoad() {
    this.toggleObject = showTextfield;  // Initalize view with text field for user input
    this.storage.get('FirstStartComplet').then((terminated)=>{ // check if first start, normal start or reminder
    console.log("FirstStartComplete terminated: " + terminated)
    if(terminated == "reminder"){
      this.reminderAppStart();        //start the reminder function
    }
    else if(terminated == null){
      this.firstAppStart();           //methode if the app is started the first time
    }
    else{
      this.normalAppStart();          //methode for other app starts. (no reminder, not first start)
    }
  })
}
/*****************************************************************************
First App start
this part of the programm is used if the user start the app for the first time
*****************************************************************************/

//Method for register the name of the user
firstAppStart() {
this.chmedHandler.saveEmptyMedicationplan();
// this.storage.set('chatlog', []);
let tempTakingTime = ["08:00","12:00","18:00","22:00"] // set standart times for the taking times
this.storage.set('takingTime',tempTakingTime) // save the taking times to the storrage
this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Hello_1)
setTimeout(()=> this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Hello_2),eMMAWaitingTimeDouble);
this.overrideSendbutton("questionPinNecessary"); //nect metode is the Pin question
}
//Method to aks the user if a pin is necessary
questionPinNecessary(name:string){
//check if name was not empty
if(name == null){
//restart with the first function
this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_NoName);
}
else{
  this.storage.set('name',name);
  this.botService.setUservar('name', name);
  this.sendEmmaText("Hallo " + name+ "\n"+ this.eMMA.messageEMMA_FirstStart_questionPin);
  setTimeout(() => this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionPin2),eMMAWaitingTime);
  this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionPin_Yes,"inputPin",this.eMMA.messageEMMA_FirstStart_questionPin_No,"questionAthlete");
  //if pin necessary go to pin input. else go to qeustion athlete
}
}
//register the pin for the app
inputPin(){
this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Pin);
this.overrideNumberSendButton("questionAthlete");
}
//register if the user is an athleth
questionAthlete(input:string){
if(input != this.eMMA.messageEMMA_FirstStart_questionPin_No){
  this.storage.set('Pin', input); // set the pin
}
else{
  this.storage.set('Pin', null); // set no pin
}
this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionAthlete);
this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionAthlete_Yes,"saveAthlete",this.eMMA.messageEMMA_FirstStart_questionAthlete_No,"saveAthlete");
}
saveAthlete(input: string){
  //save athlete information to storage
  if(input == this.eMMA.messageEMMA_FirstStart_questionAthlete_Yes ){
  this.storage.set('athlete', true)
}
else{
  this.storage.set('athlete', false)
}
this.questionDriver();
}
//aks the user if he has a driving licence
questionDriver(){
this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionDriver);
this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionDriver_Yes,"saveDriver",this.eMMA.messageEMMA_FirstStart_questionDriver_No,"saveDriver");
}
//save driving licence information to storage
saveDriver(input:string){
if(input == this.eMMA.messageEMMA_FirstStart_questionDriver_Yes ){
  this.storage.set('driver', true)
}
else {
  this.storage.set('driver', false)
}
this.questionMediplan();
}
//ask the user if he wants to import the eMedication plan information
questionMediplan(){
this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImportMediplan);
this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImportMediplan_Yes,"mediplanImport",this.eMMA.messageEMMA_FirstStart_questionImportMediplan_No,"questionEHealth");
}
//ask the user if he wants to import the eMedication plan information if the first try wasn't sucessful
questionMediplanAgain(){
  this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImportMediplanAgain);
  this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImportMediplan_Yes,"mediplanImport",this.eMMA.messageEMMA_FirstStart_questionImportMediplan_No,"questionEHealth");
}
  //import the eMedication plan
  mediplanImport(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_ImportMediplan_OpenScanner); //inform the user that the scanner will be opend
    setTimeout(() => {
      let scanner = new barcodeService(this.storage)   //initialize new scanner
      scanner.scanQRcodeForJSON().then((success)=>{               //check if the scann was successfull
      if(success){
        this.sendEmmaTextNow(this.eMMA.messageEMMA_FirstStart_ImportMediplan_success)  //next step
        setTimeout(() => this.questionEHealth() , eMMAWaitingTimeDouble);
      }
      else {
        this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_ImportMediplan_Error)  //try again
        setTimeout(() => this.questionMediplanAgain(), eMMAWaitingTime);
      }
    })
  }, eMMAWaitingTimeDouble);
}
//ask the user if he want to logg in with his eHealht password and username
questionEHealth(){
  this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImporteHealth);
  this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImporteHealth_Yes,"eHealthUsername",this.eMMA.messageEMMA_FirstStart_questionImporteHealth_No,"questionDataSecurity");
}
eHealthUsername(){
  this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questioneHalthUsername);
  this.overrideSendbutton("eHealthPassword");
}
eHealthPassword(input: string){
  this.storage.set('UsernameEHealht', input)
  this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questioneHalthPasword);
  this.overridePasswordSendButton("testUsernamePassword");
}
testUsernamePassword(input: string){
  this.storage.get('UsernameEHealht').then((name)=>{
    var tempName = name;
    let barService = new barcodeService(this.storage);
    if(tempName == "marie@emma.ch"&&input == "Emma1234."){
      barService.updateMidataFromConversation(name, input)
      this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_eHealthCorrect)
      setTimeout(() => this.questionDataSecurity(),eMMAWaitingTime);
    }
    else{
      this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_eHealthWrong);
      this.eHealthUsername();
    }
  })
}
//aks the user if he want more information about the data security
questionDataSecurity(){
this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionDatasecurity)
this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionDatasecurity_Yes,"DataSecurity",this.eMMA.messageEMMA_FirstStart_questionDatasecurity_No,"eMMATutorial");
}
//show the data security information
DataSecurity(){
this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Datasecurity)
setTimeout(() => this.eMMATutorial(),eMMAWaitingTime);
}
eMMATutorial(){
  //finish the first app start and set all needed parameters
  this.storage.set('FirstStartComplet', true) //first start is complet
  let tempTakingTime = ["08:00","12:00","18:00","22:00"] // set standart times for the taking times
  this.storage.set('takingTime',tempTakingTime) // save the taking times to the storrage

  this.storage.get("checks").then((checks) =>{
    console.log(checks);
    if(checks != null){
      checks = checks.body.medicaments
      var output:string = "";
      // Creates an Object for each Check of each Medication
      checks.forEach((item,index) => {
      var nutrition:string;
      var tempString = item.checks["1"].rem

      if(tempString.search(" - ") == -1){
        nutrition = "";
      }
      else{
        nutrition = tempString.slice(tempString.indexOf(" - ")+3)
        nutrition = nutrition.slice(0,nutrition.indexOf(","))
        console.log(nutrition)
        output += "- "+nutrition+ "\n"
      }
    })
    console.log(output)
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Tutorial_2 + "\n" + output); //inform the patient what he can do now
    setTimeout(() => this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Tutorial), eMMAWaitingTimeDouble);

  }
})

this.overrideSendbutton("question");                            //switch to question mode
this.eMMANewComplianceObj();                                    //create new compliance obj
}
/*****************************************************************************
Reminder for eMMA

this part of the Programm is called when a Local reminder has been trigered
in the application

*****************************************************************************/
reminderAppStart(){ //start the reminder function, first check if a pin is necessary
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
//check if the user knows the pin
checkPin(input: string){
this.storage.get('Pin').then((Pin)=>{
  var tempPin = Pin;
  if(input == tempPin){
    this.reminderAppStartAfterPin()
    //start reminder function
  }
  else {
    this.sendEmmaText(this.eMMA.messageEMMA_WrongPin)
    //try again
  }
})
}
reminderAppStartAfterPin(){
  this.storage.get('name').then((name)=>{ //get the patient name
    var Name = name;
    let myHours = this.getLocalHour();
    let myMinute = this.getLocalMinute();
    let time = myHours + ":"+ myMinute; //save the local time Hours and Minutes to a String
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_questionAll_1 + Name)
    setTimeout(() => this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_questionAll_2 + time +this.eMMA.messageEMMA_reminderAppStart_questionAll_3), eMMAWaitingTime);
    this.overrideAnswerButtonsOneButton(this.eMMA.messageEMMA_reminderAppStart_showMedication,"AwnswerReminder")//open the reminder after pressing the buttion
  })
}
AwnswerReminder(){
  this.toggleObject = showNothing;
  //call the last trigerred notification to check the day time
//  LocalNotifications.getTriggered(1).then((res)=>{
//    let dayTime:any
//    try{
//      dayTime = res[0].data; // was ["0"] ? hessg1 5.4.
//    }
//    catch(e){
//      alert("error"); // if the date time is not defined take morning
//      dayTime = 0;
//    }

    // workaround for tests: always ask for morning med. - hessg1 5.4.
    // TODO: fix reminder stuff
    let dayTime = 0;

    this.storage.get('takingTime').then((takingtimes)=>{
      // let takingTime = takingtimes;
      // let newTime:String = takingTime[dayTime]
      // let myHour = newTime.substr(0,2)
      // let myMinute = newTime.substr(3,2)
      // let dayoffset = false
      setTimeout(() =>   new Promise((resolve, reject) => {
        this.navCtrl.push(MedicationReminderViewPage,
          {state: dayTime, resolve: resolve});
        }).then(data => {
          let returnvaluePatientCompliance=data;
          this.storage.set('returnvaluePatientCompliance',returnvaluePatientCompliance)
          this.returnFromMedication()
            // dayTime =dayTime + 1;
            // if(dayTime == 4){
            //   dayTime = 0;
            //   dayoffset = true;
            // }
            //this.addlocalnotification(myHour,myMinute,dayTime,dayoffset)
        }),eMMAWaitingTimeDouble);
      })
    }//)
  //}

finishReminder(input:string){
  if(input != ""){  //if the methode has an input
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_finishNachBedarf);
  }else{
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_finish);
  }
  this.overrideSendbutton("question");  //move to the question state
  this.storage.set('FirstStartComplet', true)
}
returnFromMedication(){
  let medicationNotTaken = "";        //initalize empty medication list
  let finishReminder = true;          //set flag for check if the reminder should be finished after this methode
  this.storage.get('returnvaluePatientCompliance').then((res)=>{  //get compliance data
  let returnvaluePatientCompliance = res;
  for(let pos in returnvaluePatientCompliance){                 //step throught all medications in the compliance data
    if(returnvaluePatientCompliance[pos].taken == 0){           //if not taken
    if(returnvaluePatientCompliance[pos].dosage == "nach Bedarf"){  //and if the comment is nach bedarf
    medicationNotTaken = medicationNotTaken + "Medikament nach Bedarf;\n" + returnvaluePatientCompliance[pos].title + "\n"  //add to text
  }
  else{
    //if one medication which is not "nach Bedarf" is not taken, then the reminder function is not finsiched. Ask the patient why he didn't take his drug
    medicationNotTaken = medicationNotTaken +  returnvaluePatientCompliance[pos].title + "\n"
    finishReminder = false
  }
}
}
if(finishReminder){
  this.finishReminder(medicationNotTaken);
  this.addComplianceInformation("kein Grund");
}else{  //Ask the patient why he didn't take his drug
//he can choose betwen leaving a note or say nothing
this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_1 + "\n" + medicationNotTaken + this.eMMA.messageEMMA_reminderAppStart_why_2)
this.overrideAnswerButtons(this.eMMA.messageEMMA_reminderAppStart_why_Note,"leaveNote",this.eMMA.messageEMMA_reminderAppStart_why_notSpecified,"finishReminderNotSpecified")
}
})
}
leaveNote(){
  //leave a note why the User hasn't took his medication
  this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_LeaveNote);
  this.overrideSendbutton("finishReminderNote");
}
finishReminderNote(input:string){
  //Save Note to Compliance
  this.addComplianceInformation(input);
  this.finishReminderNotTaken();
  this.overrideSendbutton("question");  //move to the question state
  this.storage.set('FirstStartComplet', true)
}
finishReminderNotSpecified(input:string){
  //Save not specified to Compliance
  this.addComplianceInformation("kein Grund");
  this.finishReminderNotTaken();
  this.overrideSendbutton("question");  //move to the question state
  this.storage.set('FirstStartComplet', true)
}
finishReminderNotTaken(){
  //Methode if the Patinet hasn't took his medication
  let output = this.eMMA.messageEMMA_reminderAppStart_finishNotTaken;
  let medication = "";
  this.storage.get('returnvaluePatientCompliance').then((res)=>{
    let returnvaluePatientCompliance = res;
    for(let pos in returnvaluePatientCompliance){                                       //get all medications in compliance
      if(returnvaluePatientCompliance[pos].taken == 0){                                 //if not taken
      if(returnvaluePatientCompliance[pos].dosage != "nach Bedarf"){                  //if not "nach Bedarf"
      medication = medication +  returnvaluePatientCompliance[pos].title + " "      //ad medication name to text
    }
  }
}
this.sendEmmaText(output);
setTimeout(() =>
this.storage.get('medicationData').then((res)=>{                                    //get the drug list json for more information about the drugs
  let drugList = res;
  for(var pos in drugList){                                                      //stepp trought all drugs in drugList
    if(medication.includes(drugList[pos].title)){
    this.sendEmmaTextNow("Bei " + drugList[pos].title + " habe ich " + drugList[pos].TkgRsn  + " hinterlegt\n" ) //get the user the information why he should take his drug
  }
}
})
,eMMAWaitingTimeDouble)
})
}
/*****************************************************************************

Question for eMMA
Methode for awnser the questions of the user

*****************************************************************************/
normalAppStart() {
  this.storage.get('name').then((name)=>{
    var Name = name;
    this.sendEmmaText(this.eMMA.messageEMMA_Normal_Start_1 + Name);
    setTimeout(() => this.sendEmmaText(this.eMMA.messageEMMA_Normal_Start_2), eMMAWaitingTime);
    this.overrideSendbutton("question");
  })
}
question(input:string){
  this.questionhandler.returnAnswer(input).then((res)=>{
    var answereMMA:string = res
    this.sendEmmaText(answereMMA)
    setTimeout(() => {
      var myHour: Number = this.getLocalHour()
      var myMinute: Number = this.getLocalMinute()
      if(answereMMA == this.questionhandler.messageEMMA_Reminder_Night){
        this.addlocalnotification(myHour,myMinute,3,false)  //ad reminder for night
      }
      else if(answereMMA == this.questionhandler.messageEMMA_Reminder_Eavening){
        this.addlocalnotification(myHour,myMinute,2,false)//ad reminder for Eavening
      }
      else if(answereMMA == this.questionhandler.messageEMMA_Reminder_Midday){
        this.addlocalnotification(myHour,myMinute,1,false)//ad reminder for midday
      }
      else if(answereMMA == this.questionhandler.messageEMMA_Reminder_Morning){
        this.addlocalnotification(myHour,myMinute,0,false)//else add reminder for morning
      }
      else if(answereMMA == this.questionhandler.messageEMMA_Delete_Storage){
        this.storage.clear(); //cleare the storage of the app. Force a new app start
        setTimeout(() =>
        this.messages = [],
        this.chatlog = null,
        this.ionViewDidLoad(),
        eMMAWaitingTimeDouble * 2)

      }
      else if(answereMMA == this.questionhandler.messageEMMA_Nutrition){
        this.navCtrl.push(NutritionPage) //open nutrition page
      }
      else if(answereMMA == this.questionhandler.messageEMMA_Compliance){
        this.navCtrl.push(MyMedicationDiaryPage)//open diary page
      }
      else if((answereMMA == this.questionhandler.messageEMMA_Selfmedication)||(answereMMA == this.questionhandler.messageEMMA_Medication)){
        this.navCtrl.push(MyMedicationPage)//open self medication page
      }
      else if(answereMMA == this.questionhandler.messageEMMA_About){
        this.navCtrl.push(AboutEmmaPage)//open about eMMA page
      }
    }
    ,eMMAWaitingTimeDouble);
  });
}
/*****************************************************************************

Funtions for Conversation.ts
All funcitons for making the conversation works

*****************************************************************************/

/*----------------------------------------------------------------------------*/
/* Methode for createing a new compliance obj
/* add a new copliance obj to the storage
/*----------------------------------------------------------------------------*/
eMMANewComplianceObj(){
  this.storage.ready().then(()=>{
    this.storage.get('medicationData').then((res)=>{
      var tempMedicationData = res;
      console.log("Medikationsdaten",tempMedicationData)
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
})
}

/*----------------------------------------------------------------------------*/
/* This method is used to write a text from eMMA on the conversation page
/*
/* edited by hessg1 on 26.03.
/*----------------------------------------------------------------------------*/
sendEmmaText(message:string){
  this.processMsg({
    text: message,
    identity: 'emma',
    time: this.getLocalTime()
  });
}

/*----------------------------------------------------------------------------*/
/* This methode is used to write a text from eMMA on the conversation page NOW
/*
/* edited by hessg1 on 26.03.
/*----------------------------------------------------------------------------*/

sendEmmaTextNow(message:string){
  this.processMsg({
    text: message,
    identiy: 'emmaNOW',
    time: this.getLocalTime()
  })
}


/*----------------------------------------------------------------------------*/
/* This Methode is used to set a text on two buttions to aks the user someting
/*
/*----------------------------------------------------------------------------*/
overrideAnswerButtons(text1: string, function1: string, text2: string, function2: string) {
  this.toggleObject = showNothing;
  setTimeout(() => this.toggleObject = showButtons , eMMAWaitingTime); // show buttions
  this.preAnswers = []
  for (let i = 1; i <= 2; i++) {  //create a buttion for every input pair
    this.preAnswers.push({
    text: eval("text" + i),
    id: i,
    callFunction: eval("function" + i)
  })
}
}
/*----------------------------------------------------------------------------*/
/* This Methode is used to write a text to a single button on the conversation
/*
/*----------------------------------------------------------------------------*/
overrideAnswerButtonsOneButton(text1: string, function1: string) {
  this.toggleObject = showNothing;
  setTimeout(() => this.toggleObject = showsingleButton , eMMAWaitingTime);  //show the single button
  this.preAnswers = [];
  this.preAnswers.push({  //pus the information in the button
    text: text1,
    id: 1,
    callFunction: function1
  })
}
/*----------------------------------------------------------------------------*/
/* This Methode is used to give the user a text field to write a question or awnser one
/*
/*----------------------------------------------------------------------------*/
overrideSendbutton(newfunction:string){
  this.toggleObject = showNothing;
  setTimeout(() => this.toggleObject = showTextfield,eMMAWaitingTime);
  this.sendButton = newfunction;
}
/*----------------------------------------------------------------------------*/
/* This Methode is used to write a passwort i a secret password field
/*----------------------------------------------------------------------------*/
overridePasswordSendButton(newfunction:string){
  this.toggleObject = showNothing;
  setTimeout(() => this.toggleObject = showPasswordField,eMMAWaitingTime);
  this.sendButtonPW = newfunction;
}
/*----------------------------------------------------------------------------*/
/* This Methode is used to write a text info a number text field
/*
/*----------------------------------------------------------------------------*/
overrideNumberSendButton(newfunction:string){
  this.toggleObject = showNothing;
  setTimeout(() => this.toggleObject = showNumberField,eMMAWaitingTime);
  this.sendButtonNumber = newfunction;
}
/*----------------------------------------------------------------------------*/
/* This method is used to write a text from the user on the Conversation Page
/*
/* edited by hessg1 on 26.03.
/*----------------------------------------------------------------------------*/
reply(answer) {
  this.processMsg({
    text: answer.text,
    identity: 'user',
    time: this.getLocalTime()
  });
  this[answer.callFunction](answer.text);
  setTimeout(() =>{  this.content.scrollToBottom();},50);
}

/*----------------------------------------------------------------------------*/
/* This method is used to write a text from the user on the Conversation Page
/*
/* edited by hessg1 on 26.03.
/*----------------------------------------------------------------------------*/
sendMessage(myReply, myFunc) {
  this.processMsg({
    text: myReply.value,
    identity: 'user',
    time: this.getLocalTime()
  })

  this[myFunc](myReply.value);
  myReply.value = "";
  setTimeout(() =>{ this.content.scrollToBottom();}, 50);
}

/*----------------------------------------------------------------------------*/
/* This methode is used to write a Number Pin text from the user on the Conversation Page
/*
/*----------------------------------------------------------------------------*/

sendPinPW(myReply, myFunc) {
  this.processMsg({
    text: "****",
    identity: 'user',
    time: this.getLocalTime()
  })
  this[myFunc](myReply.value);
  myReply.value = "";
  setTimeout(() =>{ this.content.scrollToBottom();}, 50);
}

/*----------------------------------------------------------------------------*/
/* This Methode is used to write the new compliance information to the storage
/*
/*----------------------------------------------------------------------------*/
addComplianceInformation(information:any){

  LocalNotifications.getTriggered(1).then((res)=>{
    let dayTime = res["0"].data;
    var complianceObj;
    this.storage.get('ComplianceData').then((res)=>{
      complianceObj = res;
      this.storage.get('returnvaluePatientCompliance').then((res)=>{
        let returnvaluePatientCompliance = res;
        //Add Date
        let todayDate:any = new Date();
        let actualYear = todayDate.getFullYear();
        let actualMonth;
        let actualDay;
        //Add Month
        if(todayDate.getMonth() < 10){    //ad a extra 0 to the Month if <10 (form 9 to 09)
        actualMonth = "0" + (todayDate.getMonth() + 1);
      }else{
        actualMonth = (todayDate.getMonth() + 1);
      }
      //Add Day
      if(todayDate.getDate() < 10){//ad a extra 0 to the date if <10 (form 9 to 09)
      actualDay = "0" + todayDate.getDate();
    }else{
      actualDay = todayDate.getDate()
    }
    //Create time format for today
    let complianceDate = actualDay + "." + actualMonth +"."+actualYear; //ad date to one string
    for(let pos in returnvaluePatientCompliance){   //step throught every pos in compliance data drugs
    for(var posComliance in complianceObj.DrugList){//step thougth every pos in Json drug list
    if(complianceObj.DrugList[posComliance].Name == returnvaluePatientCompliance[pos].title){//if same title
    let lengthOfArry = complianceObj.DrugList[posComliance].Compliance.length //get lenght
    if(lengthOfArry == 0 || (complianceObj.DrugList[posComliance].Compliance[lengthOfArry-1] && complianceObj.DrugList[posComliance].Compliance[lengthOfArry-1].Date != complianceDate)){
    //if last position is empty
    lengthOfArry++;
    complianceObj.DrugList[posComliance].Compliance.push({ //ad empty entry to last position
      "Date": complianceDate,
      "D":[
        undefined,undefined,undefined,undefined
      ]
    })
  }
  //update information at position
  if(returnvaluePatientCompliance[pos].taken != 1){
  complianceObj.DrugList[posComliance].Compliance[lengthOfArry-1].D[dayTime] = information;
}
else{
  complianceObj.DrugList[posComliance].Compliance[lengthOfArry-1].D[dayTime] = 1;
}
}
}
}
//save information to storage
this.storage.set('ComplianceData',complianceObj)
})
})
});
}
/*----------------------------------------------------------------------------*/
/* This Methode is used to add a local notification
/*
/*----------------------------------------------------------------------------*/
addlocalnotification(hours:any,minutes:any,timeOfDay:any,DayOffset:any){
  console.log("add notification: " + hours + ":" + minutes + " timeOfDay:" + timeOfDay + " DayOffset:" + DayOffset);
  let firstNotificationTime  = new Date()
  firstNotificationTime.setHours(hours)
  firstNotificationTime.setMinutes(minutes)
  if(DayOffset){
    firstNotificationTime.setDate(firstNotificationTime.getDate()+1)
  }
  LocalNotifications.clearAll()
  let myHour = this.getLocalHour();
  let myMinute = this.getLocalMinute();
  let time = myHour + ":" + myMinute;
  let notification = {
    id: 1,
    title: 'eMMA hat dir geschrieben',
    text: 'Es ist jetzt ' + time+". Ich wollte dich daran erinnern",
    data: timeOfDay,
    at: firstNotificationTime,
  };
  if(this.platform.is('cordova')){
    // Cancel any existing notifications
    LocalNotifications.cancelAll().then(() => {
    // Schedule the new notifications
    LocalNotifications.schedule(notification);
    let alert = this.alertCtrl.create({
      title: 'Notifications set\n'+ hours +":" + minutes + " Uhr",
      buttons: ['Ok']
    });
    alert.present();
  });
}
if(notificationSingelton){ //singelton to make sure the methode is called just one time
  notificationSingelton = false;
  this.triggerNotification()
}
}
triggerNotification(){  //shedule the notifications
  LocalNotifications.on("trigger", (event)=>{
  this.storage.set('FirstStartComplet', "reminder") //set the reminder start functions
   // this.messages = [];
   // this.ionViewDidLoad();
})
}
/*----------------------------------------------------------------------------*/
/* This Methode is used to get the local hours
/*
/*----------------------------------------------------------------------------*/
getLocalHour(){
  var myDate = new Date();
  var myHour: any = myDate.getHours();
  if(myHour<10){
    myHour = "0" + myHour;
  }
  return myHour;
}
/*----------------------------------------------------------------------------*/
/* This Methode is used to get the local minutes
/*
/*----------------------------------------------------------------------------*/
getLocalMinute(){
  var myDate = new Date();
  var myMinute:any = myDate.getMinutes();
  if(myMinute<10){
    myMinute = "0" + myMinute;
  }
  return myMinute;
}

/*----------------------------------------------------------------------------*/
/* This Method is used to get the local time as a String
/* in the format hh:mm:ss.m
/*
/* author: hessg1
/*----------------------------------------------------------------------------*/

getLocalTime(){
  var myDate = new Date();

  var hour: any = myDate.getHours();
  hour = (hour<10) ? "0" + hour : hour;

  var minute: any = myDate.getMinutes();
  minute = (minute<10) ? "0" + minute : minute;

  var second: any = myDate.getSeconds();
  second = (second<10) ? "0" + second : second;

  var milli: any = myDate.getMilliseconds();
  milli = (milli<10) ? "0" + milli : milli;
  milli = String(milli).slice(0,2);

  return hour + ":" + minute + ":" + second + "." + milli;
}

/*----------------------------------------------------------------------------*/
/* This method processes messages, as it sends them to the chat screen and also
/* saves them in the chatlog that is persisted in storage
/*
/* author: hessg1
/*----------------------------------------------------------------------------*/

processMsg(msg: any){
  if(this.chatlog == null){
   this.chatlog = [];
  }

  if(msg.identity == 'emma'){
    this.messages.push({
      text: 'eMMA schreibt....',  //write..... on the screen, like emma is thinking what she should write
      identity: 'emma',
      time: msg.time.slice(0,5) // show only hours and minutes
    })
    this.content.scrollToBottom(), // scroll down in the view to the last message of eMMA
    setTimeout(() => this.messages[this.messages.length-1].text = msg.text, eMMAWaitingTime),
    // replace 'eMMA schreibt...' with actual text
    setTimeout(()=> this.content.scrollToBottom(),eMMAWaitingTime+50)//scroll to bottom again
  }
  else if(msg.identity == 'emmaNOW'){
    this.messages.push({
      text: msg.text,
      identity: 'emma',
      time: this.getLocalTime()
    }),
    setTimeout(()=> this.content.scrollToBottom(),50) //scroll down in the view to the last message of eMMA
  }
  else {
    this.messages.push({
      text: msg.text,
      identity: msg.identity,
      time: msg.time.slice(0,5) // show only hours and minutes
    });
  }
  this.chatlog.push(msg);
  this.storage.set('chatlog', this.chatlog);
}



scrollToBottomOnFocus(){
  setTimeout(() => this.content.scrollToBottom(), eMMAWaitingTime)
}
}
