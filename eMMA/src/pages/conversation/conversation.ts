import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import {ViewChild, Component, ElementRef} from '@angular/core';
import {Content} from 'ionic-angular/index';
import { Storage } from '@ionic/storage';
import { eMMAText } from '../../pages/conversation/eMMA';
import { Page1 } from '../../pages/page1/page1';
import { UpdatePage } from '../../pages/update/update';
import { barcodeService } from '../../services/barcodeService';
import { AlertController } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage) {
    this.messages = [];
    this.preAnswers = [];
    this.toggleObject = showTextfield;
  }

  eMMA = new eMMAText();
  ionViewDidLoad() {
    this.toggleObject = showTextfield;
    var Start = "First";
    if(Start == "First"){
      this.firstAppStart();
    }
    else if("reminder"){
     this.reminderAppStart();
    }
    else{
      this.normalAppStart();
    }
  }

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
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionAthlete_Yes,"questionDriver",this.eMMA.messageEMMA_FirstStart_questionAthlete_No,"questionDriver");
  }
  questionDriver(input:String){
    if(input == this.eMMA.messageEMMA_FirstStart_questionAthlete_Yes ){
      this.storage.set('athlete', true)
    }
    else{
      this.storage.set('athlete', false)
    }
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionDriver);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionDriver_Yes,"questionMediplan",this.eMMA.messageEMMA_FirstStart_questionDriver_No,"questionMediplan");
  }
  questionMediplan(input:String)
  {
    if(input == this.eMMA.messageEMMA_FirstStart_questionDriver_Yes ){
      this.storage.set('driver', true)
    }
    else{
      this.storage.set('driver', false)
    }

    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImportMediplan);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImportMediplan_Yes,"mediplanImport",this.eMMA.messageEMMA_FirstStart_questionImportMediplan_No,"questionEHealth");
  }
  mediplanImport(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_ImportMediplan_OpenScanner);
    setTimeout(() => {
      let scanner = new barcodeService(this.storage)
      scanner.scanQRcodeForJSON();
      this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_ImportMediplan_sucsess);
      }, 4000);
      console.log("Works")
      this.questionEHealth();
  }
  questionEHealth(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImporteHealth);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImporteHealth_Yes,"eHealthUsername",this.eMMA.messageEMMA_FirstStart_questionImporteHealth_No,"morningTime");
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
    setTimeout(() => this.morningTime(),eMMAWaitingTime);
    //else
    //this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_eHealthWrong);
    //this.eHealthUsername
  }
  morningTime(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Einnahmezeit0800);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_answer_Yes,"changeMorningTime",this.eMMA.messageEMMA_answer_No,"noonTime");
  }
  changeMorningTime(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_newTime);
    this.overrideSendbutton("noonTime");
  }
  noonTime(input:String){
    if(input != this.eMMA.messageEMMA_answer_No)
    {
      this.storage.set('morningTime', input)
    }
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Einnahmezeit1200);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_answer_Yes,"changeNoonTime",this.eMMA.messageEMMA_answer_No,"eveningTime");
  }
  changeNoonTime(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_newTime);
    this.overrideSendbutton("eveningTime");
  }
  eveningTime(input:String){
    if(input != this.eMMA.messageEMMA_answer_No)
    {
      this.storage.set('noonTime', input)
    }
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Einnahmezeit1800);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_answer_Yes,"changeEveningTime",this.eMMA.messageEMMA_answer_No,"nightTime");
  }
  changeEveningTime(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_newTime);
    this.overrideSendbutton("eveningTime");
  }
  nightTime(input:String){
    if(input != this.eMMA.messageEMMA_answer_No)
    {
      this.storage.set('eveningTime', input)
    }
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Einnahmezeit2200);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_answer_Yes,"changeNightTime",this.eMMA.messageEMMA_answer_No,"eMMATourtorial");
  }
  changeNightTime(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_newTime);
    this.overrideSendbutton("eMMATourtorial");
  }
  eMMATourtorial(input:String){
    if(input != this.eMMA.messageEMMA_answer_No)
    {
      this.storage.set('nightTime', input)
    }
    this.storage.set('FirstStartComplet', true)
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Tourtorial);
    this.overrideSendbutton("question");
  }
//Reminder Functions for eMMA
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
  finishReminderSick(input:String){
    //Save Sick to Compliance
    this.finishReminder();
  }
//Question functions for eMMA (Normal App Start)
  normalAppStart() {
    var Name = "Max"; //get Name from storage
    this.sendEmmaText(this.eMMA.messageEMMA_Normal_Start_1 + Name + this.eMMA.messageEMMA_Normal_Start_2);
    this.overrideSendbutton("question");
  }
  question(input:String){
    if(input == "Nahrung"){
      this.sendEmmaText("Du möchtest etwas über die Nahrung wissen")
    }
    if(input == "Reminder"){
      this.reminderAppStart()
    }
  }
  sendEmmaText(message:String){
    //Püntkli azeige
  setTimeout(() =>
  this.messages.push({
      text: 'eMMA schreibt....',
      identity: 'emma'
    }),
    this.content.scrollToBottom(),
    setTimeout(() => this.messages[this.messages.length-1].text = message, eMMAWaitingTime),
    setTimeout(()=> this.content.scrollToBottom(),eMMAWaitingTime+50)
  )}
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

    setTimeout(() =>
  {
      this.content.scrollToBottom();
  },
40);
  }
  sendMessage(myReply, myFunc) {
    this.messages.push({
      text: myReply.value,
      identity: 'user'
    })
    this[myFunc](myReply.value);
    myReply.value = null;
  }
}
