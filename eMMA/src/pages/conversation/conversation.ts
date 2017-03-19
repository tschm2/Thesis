import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import {ViewChild, Component, ElementRef} from '@angular/core';
import {Content} from 'ionic-angular/index';
import { Storage } from '@ionic/storage';
import { eMMAText } from '../../pages/conversation/eMMA';
import { Page1 } from '../../pages/page1/page1';
      import { UpdatePage } from '../../pages/update/update';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})

export class ConversationPage {

  @ViewChild(Content)  content: Content;
  messages: any[];
  preAnswers: any[];
  sendButton: String;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage) {
    this.messages = [];
    this.preAnswers = [];

  }
  eMMA = new eMMAText();
  ionViewDidLoad() {
    var Start = "reminder";
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
      this.storage.ready().then(() => {
       this.storage.set('name', input);
       })
      this.sendEmmaText("Hallo " + input+ "\n"+ this.eMMA.messageEMMA_FirstStart_questionPin);
      this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionPin_Yes,"inputPin",this.eMMA.messageEMMA_FirstStart_questionPin_No,"questionAthlete");
    }
  }
  inputPin(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Pin);
    this.overrideSendbutton("questionAthlete");
  }
  questionAthlete(input:String){
    if(input != this.eMMA.messageEMMA_FirstStart_questionPin_No)
    {
      this.storage.ready().then(() => {
       this.storage.set('Pin', input);
       })
    }
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionAthlete);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionAthlete_Yes,"questionDriver",this.eMMA.messageEMMA_FirstStart_questionAthlete_No,"questionDriver");
  }
  questionDriver(input:String){
    //save input to storage athleth
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionDriver);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionDriver_Yes,"questionMediplan",this.eMMA.messageEMMA_FirstStart_questionDriver_No,"questionMediplan");
  }
  questionMediplan(input:String)
  {
    //save input to storage driver
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImportMediplan);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImportMediplan_Yes,"questionEHealth",this.eMMA.messageEMMA_FirstStart_questionImportMediplan_No,"questionEHealth");
  }
  questionEHealth(input:String){
    if(input == this.eMMA.messageEMMA_FirstStart_questionImportMediplan_Yes)
    {
      this.navCtrl.push(UpdatePage);
    }
    //after return
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImporteHealth);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImporteHealth_Yes,"morningTime",this.eMMA.messageEMMA_FirstStart_questionImporteHealth_No,"morningTime");
  }
  morningTime(input:String){
    if(input == this.eMMA.messageEMMA_FirstStart_questionImporteHealth_Yes)
    {
      this.navCtrl.push(UpdatePage);
    }
    //after return
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
      //save Time to Storrage
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
      //save Time to Storrage
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
      //save Time to Storrage
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
      //save Time to Storrage
    }
    //save First start complet
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Tourtorial);
    this.overrideSendbutton("quesiton");
  }
//Reminder Functions for eMMA

  reminderAppStart(){
    var Name = "Max"; //get Name from storage
    var Time = "12:00";
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_questionAll_1 + Name + this.eMMA.messageEMMA_reminderAppStart_questionAll_2 + Time + this.eMMA.messageEMMA_reminderAppStart_questionAll_3);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_reminderAppStart_questionAll_Yes,"finishReminder",this.eMMA.messageEMMA_reminderAppStart_questionAll_No,"reminderNo");
  }
  finishReminder(){
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_finish);
    this.overrideSendbutton("quesiton");
  }
  reminderNo(){
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_finish);
    this.navCtrl.push(Page1);
  }
  returnFromMedication(){
  var Medication = "-Sortis \n-Dafalgan"
  this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_1 + Medication + this.eMMA.messageEMMA_reminderAppStart_why_2)
  this.overrideAnswerButtons_Four(this.eMMA.messageEMMA_reminderAppStart_why_sick,"finishReminderSick",this.eMMA.messageEMMA_reminderAppStart_why_sideEffect,"whichSideEffects",this.eMMA.messageEMMA_reminderAppStart_why_Note,"leaveNote",this.eMMA.messageEMMA_reminderAppStart_why_notSpecified,"finishReminderNotSpecified")
  }
  leaveNote(){
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_LeaveNote);
    this.overrideSendbutton("finishReminderNote");
  }
  whichSideEffects(){
    var SideEffect = "-Kopfschmerzen\n-Bauchschmerzen"
    this.sendEmmaText(this.eMMA.messageEMMA_reminderAppStart_why_sideEffectMayInclude_1 + SideEffect + this.eMMA.messageEMMA_reminderAppStart_why_sideEffectMayInclude_2);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_answer_Yes,"finishReminderSideEffect",this.eMMA.messageEMMA_answer_No,"finishReminderSideEffect")
  }
  finishReminderSideEffect(input:String){
    //Save Sideeffect + input to Compliance
    this.finishReminder();
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
quesiton(input:String){
  if(input == "Nahrung"){
    this.sendEmmaText("Du Möchtest etwas über die Nahrung wissen")
  }
}
  normalAppStart() {
    var Name = "Max"; //get Name from storage
    this.sendEmmaText(this.eMMA.messageEMMA_Normal_Start_1 + Name + this.eMMA.messageEMMA_Normal_Start_2);
    this.overrideSendbutton("quesiton");
  }
  question(input:String){
    if(input == "Nahrung"){
      this.sendEmmaText("du hast nach Nahrung gefragt");
    }
  }
  sendEmmaText(message:String){
    //Püntkli azeige
  setTimeout(() => this.messages.push({
      text: 'eMMA schreibt....',
      identity: 'emma'
    }), 500)
    setTimeout(() => this.messages[this.messages.length-1].text = message, 2000)
  }
  overrideAnswerButtons(text1: String, function1: String, text2: String, function2: String) {
    //ausblenden Texteingabe
    setTimeout(() =>   {
      this.preAnswers = []
          for (let i = 1; i <= 2; i++) {
            this.preAnswers.push({
              text: eval("text" + i),
              id: i,
              callFunction: eval("function" + i)
            })
          }
      }  , 2000);
  }
  overrideAnswerButtons_Four(text1: String, function1: String, text2: String, function2: String, text3: String, function3: String, text4: String, function4: String) {
    //ausblenden Texteingabe
    setTimeout(() =>   {
      this.preAnswers = []
          for (let i = 1; i <= 4; i++) {
            this.preAnswers.push({
              text: eval("text" + i),
              id: i,
              callFunction: eval("function" + i)
            })
          }
      }  , 2000);
  }
  overrideSendbutton(newfunction:String){
    //Aussblenden der buttons
    this.sendButton = newfunction;
  }
  reply(answer) {
    this.messages.push({
      text: answer.text,
      identity: 'user'
    })
    this[answer.callFunction](answer.text);
    this.content.scrollToBottom();
  }
  sendMessage(myReply, myFunc) {
    this.messages.push({
      text: myReply.value,
      identity: 'user'
    })
    console.log(myFunc);
    this[myFunc](myReply.value);
    myReply.value = null;
    this.content.scrollToBottom();
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
