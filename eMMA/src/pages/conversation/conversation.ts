import { NavController, NavParams } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
import {ViewChild, Component, ElementRef} from '@angular/core';
import {Content} from 'ionic-angular/index';
import { Storage } from '@ionic/storage';
import { eMMAText } from '../../pages/conversation/eMMA';



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


    var storageEmpty = "True";
    if(storageEmpty == "True"){
      this.firstAppStart();
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
    this.sendEmmaText("Hallo " + input+ "\n"+ this.eMMA.messageEMMA_FirstStart_questionPin);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionPin_Yes,"inputPin",this.eMMA.messageEMMA_FirstStart_questionPin_No,"questionAthlete");
  }
  inputPin(){
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_Pin);
    this.overrideSendbutton("questionAthlete");
  }
  questionAthlete(input:String){
    if(input != this.eMMA.messageEMMA_FirstStart_questionPin_No)
    {
      //save pin to storage
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
      //open view eMediplan
    }
    this.sendEmmaText(this.eMMA.messageEMMA_FirstStart_questionImportMediplan);
    this.overrideAnswerButtons(this.eMMA.messageEMMA_FirstStart_questionImportMediplan_Yes,"eMMADemo",this.eMMA.messageEMMA_FirstStart_questionImportMediplan_No,"eMMADemo");
  }


  normalAppStart() {
    //Show Correct Awnsers
    //this.overrideAnswerButtons("hello", "doSomething", "hello2", "doSomething")
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
