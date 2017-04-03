import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import {ViewChild, Component, ElementRef} from '@angular/core';
import {Content} from 'ionic-angular/index';
import { Storage } from '@ionic/storage';
import { eMMA} from '../../pages/conversation/eMMA';
import { questionHandler } from '../../pages/conversation/questionHandler';
import { Page1 } from '../../pages/page1/page1';
import { UpdatePage } from '../../pages/update/update';
import { barcodeService } from '../../services/barcodeService';
import { AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';

var eMMAWaitingTimeShort = 200;
var eMMAWaitingTime = 800;
var eMMAWaitingTimeDouble = 1600;

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, public http:Http) {
    this.messages = [];
    this.preAnswers = [];
    this.toggleObject = showTextfield;
  }
  eMMA = new eMMA();
  questionhandler = new questionHandler(this.storage);
  ionViewDidLoad() {
    this.toggleObject = showTextfield;
    // this.storage.get('FirstStartComplet').then((terminated)=>{
    //   var FirstStartComplet = terminated;
    //   if(FirstStartComplet == false){
    //     this.firstAppStart();
    //   }
    let start = "reminder"
      if(start == "normal"){
         this.firstAppStart();
       }
      else if(start == "reminder"){
       this.reminderAppStart();
      }
      else{
        this.normalAppStart();
      }
    // })
  }
  /*****************************************************************************

  Normal App start

  *****************************************************************************/
  firstAppStart() {
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Hello);
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
      let scanner = new barcodeService(this.storage, this.http)
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
  }
  /*****************************************************************************

  Reminder for eMMA

  *****************************************************************************/
  reminderAppStart(){
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
    var Time = "12:00";
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_questionAll_1 + Name + this.eMMA.messageEMMA_reminderAppStart_questionAll_2 + Time + this.eMMA.messageEMMA_reminderAppStart_questionAll_3);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_reminderAppStart_questionAll_Yes,"finishReminder",this.eMMA.messageEMMA_reminderAppStart_questionAll_No,"reminderNo");
  })
  }
  finishReminder(){
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_finish);
    this.overrideSendbutton("question");
  }
  reminderNo(){
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_show_Medication);
    setTimeout(() => this.navCtrl.push(Page1),eMMAWaitingTimeDouble);
  }
  returnFromMedication(){
  var Medication = "-Sortis \n-Dafalgan"
  this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_1 + Medication + this.eMMA.messageEMMA_reminderAppStart_why_2)
  this.overrideAnswerButtons(this.eMMA.messageEMMA_reminderAppStart_why_Note,"leaveNote",this.eMMA.messageEMMA_reminderAppStart_why_notSpecified,"finishReminderNotSpecified")
  }
  leaveNote(){
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_LeaveNote);
    this.overrideSendbutton("finishReminderNote");
  }
  finishReminderNote(input:String){
    //Save Note to Compliance
    this.finishReminder();
  }
  finishReminderNotSpecified(input:String){
    //Save Not SPecified to Compliance
    this.finishReminder();
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
      if(answereMMA == "Reminder"){
        this.reminderAppStart()
      }
      else{
        this.sendEmmaText(answereMMA)
      }
    });

  }
  /*****************************************************************************

  Funtions for Conversation.ts

  *****************************************************************************/

  sendEmmaText(message:String):any{
    //Püntkli azeige
    setTimeout(() =>
    this.messages.push({
        text: 'eMMA schreibt....',
        identity: 'emma'
      }),
      this.content.scrollToBottom(),
      setTimeout(() => this.messages[this.messages.length-1].text = message, eMMAWaitingTime),
      setTimeout(()=> this.content.scrollToBottom(),eMMAWaitingTime+50)
      )
      return true;
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
    this.messages.push({
      text: answer.text,
      identity: 'user'
    })
    this[answer.callFunction](answer.text);
    setTimeout(() =>{  this.content.scrollToBottom();},50);
    }
  sendMessage(myReply, myFunc) {
    this.messages.push({
      text: myReply.value,
      identity: 'user'
    })
    this[myFunc](myReply.value);
    myReply.value = "";
    setTimeout(() =>{ this.content.scrollToBottom();}, 50);
  }
}
