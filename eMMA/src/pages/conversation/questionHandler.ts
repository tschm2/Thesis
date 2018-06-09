import { Storage } from '@ionic/storage';
import { BotService } from '../../services/botService';
import { barcodeService } from '../../services/barcodeService';
import { ConversationPage} from '../../pages/conversation/conversation';

export class questionHandler {
  /* Calling the barcodeService */
  barcodeService: barcodeService;

  drugList: JSON;
  takingTime: string[];
  convPage: ConversationPage;
  emma: any;

  constructor(private storage: Storage, private botService: BotService, convPage: ConversationPage) {
	  this.barcodeService = new barcodeService(storage);
	  this.convPage = convPage;
    this.emma = convPage.eMMA;
  }

/*----------------------------------------------------------------------------*/
/*  method finds a medicament from this.drugList and returns it as an Object
/* @param name: the name of the medicament to find
/* @return: the medicament as an object. null if not found.
/* @author: hessg1
/*----------------------------------------------------------------------------*/
findMedicament(name: string): any {
 var medi = null;
  for(var pos in this.drugList){
    if(this.drugList[pos].title.toUpperCase() == name.toUpperCase()){
      medi = this.drugList[pos];
    }
  }
  return medi;
}

/*----------------------------------------------------------------------------*/
/* This method handles the user input for the question method
/*
/* the question of the user is analysed and the return value is the answer form eMMA
/* original authors: dorner / tschanz
/* refactoring author: hessg1
/*----------------------------------------------------------------------------*/
returnAnswer(question: string): any {
  var retVal: any = "";
  var list = new Array<any>() // i have no idea what this list does or if it is used anywhere... but don't change a running system :D 27.5. hessg1

  var l = this.storage.get('takingTime').then((takingtimes) => {
    this.takingTime = takingtimes;
  })
  list.push(l) //raus
  /*Ab it function und return not var*/
  var l2 = this.storage.get('medicationData').then((res) => {
    this.drugList = res;
    console.log("bot input: "+ question);
    retVal = this.botService.retrieveBotAnswer(question);
    console.log("raw bot output: " + retVal);

    // check if there is an instruction coded in the return value

    if(retVal.includes('inst#')){

      var values = retVal.split("#"); // parse the instruction syntax
      retVal = values[3]; // this is the answer we give to the user

    // doing interpretation of given instructions

    // setting the name
    if(values[1] == 'name'){
      this.storage.set('name', values[2]);
    }

    // answering question about WHEN to take the medication
    else if(values[1] == 'medWhen'){
      var medi = this.findMedicament(values[2]);
      if(medi == null){
        retVal = this.emma.messageEMMA.error;
      }
    else{
      for (var time in medi.Pos[0].D) {
        if (medi.Pos[0].D[time]) {
          retVal = retVal + this.emma.messageEMMA.takingTime[time] + this.takingTime[time] + " Uhr, " + medi.Pos[0].D[time] + " " + medi.Unit + "\n"
        }
      }
      //if the application instrucion has someting to do with "Essen" this information is also given to the user
      if (medi.AppInstr && medi.AppInstr.includes("Essen")) {
        retVal = retVal + "jeweils " + medi.AppInstr;
      }
    }
  }

  // answering question about HOW to take medication
  else if(values[1] == 'medHow'){
    var medi = this.findMedicament(values[2]);
      if(medi == null){
        retVal = this.emma.messageEMMA.error;
      }
      else if(medi.AppInstr){
        retVal += ' ' + medi.AppInstr + ' einnehmen.';
      }
      else {
        retVal = 'Ich habe leider keine Informationen über die Einnahme von ' + values[2] + '.';
      }
  }

  // answering question about WHY to take medication
  else if(values[1] == 'medWhy'){
    var medi = this.findMedicament(values[2]);
    if(medi == null){
      retVal = this.emma.messageEMMA.error;
    }
    else if (medi.TkgRsn) {
      retVal += ' ' + medi.TkgRsn + '.';
    }
    else {
      retVal =  'Ich habe leider keine Informationen über den Grund der Einnahme von ' + values[2] + ' erfasst.'; // TODO: include link to Compendium
    }
  }

  // answering question concerning the duration of medication intake
  else if(values[1] == 'medDuration'){
    var medi = this.findMedicament(values[2]);
    if(medi == null){
      retVal = this.emma.messageEMMA.error;
    }
    else if (medi.Pos[0].DtFrom && medi.Pos[0].DtTo) {
      retVal += ' Vom ' + medi.Pos[0].DtFrom + " bis zum " + medi.Pos[0].DtTo + '.';
    }
    else {
      retVal = 'Ich habe leider keine konkreten Informationen über die Einnahmedauer von ' + values[2] + ' gespeichert.';
    }
  }

  // opening a medicaments compendium page in browser
  else if(values[1] == 'compendium'){
      var medi = this.findMedicament(values[2]);
      if(medi == null || medi.Id == undefined){
        window.open("https://compendium.ch/search/" + values[2] + "/de", "_blank");
      }
      else{
        window.open("http://compendium.ch/mpub/phc/" + medi.Id + "/html", "_blank");
      }
  }

  else if(values[1] == 'scan'){
    this.barcodeService.scanMediCode(null,1,1,1,1,"").then((res)=>{
      retVal = "Gescannt: " + res;

    //   // this.storage.ready().then(()=>{
    //   //   this.storage.get('mediPlan').then((res)=>{
    //   //     res.Dt = this.drugList[this.drugList.length-1].Pos["0"].DtFrom
    //   //     res['Medicaments'] = this.drugList
    //   //     this.drugList[this.drugList.length-1].DtFrom
    //   //     this.storage.set('mediPlan', res).then(()=>{
    //   //       this.barcodeService.doChecksWithCurrentMedication();
    //   //     })
    //   //     this.storage.set("medicationData", this.drugList);
    //   //     // alert.present();
    //   //     alert("done");
    //   //     // Edits the ComplianceDataObject
    //   //     this.editComplianceData(res['Medicaments'][res['Medicaments'].length-1].title)
    //   //   })
    //   // })
    //   // this.toggleObject = 0
      })
  }

  else if(values[1] == 'compl'){
    alert('we are in compliance');
    this.convPage.AwnswerReminder();
    // TODO all the fancy things
  }

  else if(values[1] == 'button'){
    var first_button = values[2].split("|")[0];
    var second_button = values[2].split("|")[1];
    this.convPage.toggleObject = 0;
    setTimeout(() => this.convPage.toggleObject = 2 , 500); // show buttons
    this.convPage.preAnswers = [];
    this.convPage.preAnswers.push({
      text: first_button,
      id: 1,
      callFunction: null
    });

    this.convPage.preAnswers.push({
      text: second_button,
      id: 2,
      callFunction: null
    });
  }


  // this shouldn't be executed
  else{
    alert('Instruction ' + values[1] + ' not found.');
    console.log('Instruction ' + values[1] + ' not found.');
  }

}
})

list.push(l2);
return Promise.all(list).then(() => {//get the return value if the calulation is finished
  return retVal
})
}

nullfunct(){

}
}
