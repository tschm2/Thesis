import { Storage } from '@ionic/storage';
import { BotService } from '../../services/botService';
import { barcodeService } from '../../services/barcodeService';
import { ConversationPage} from '../../pages/conversation/conversation';

export class questionHandler {
  /* Calling the barcodeService */
  barcodeService: barcodeService;

  drugList: any;
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
          retVal = retVal + this.emma.messageEMMA.takingTime[time] + this.takingTime[time] + " Uhr, " + medi.Pos[0].D[time] + " " + medi.Unit + ",\n"
        }
      }
      //if the application instrucion has someting to do with "Essen" this information is also given to the user
      if (medi.AppInstr && medi.AppInstr.includes("Essen")) {
        retVal = retVal + "jeweils " + medi.AppInstr + ".";
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
      if(medi == null || medi.Id == undefined || medi.Id.toLowerCase() == values[2].toLowerCase()){
        window.open("https://compendium.ch/search/" + values[2] + "/de", "_blank");
      }
      else{
        window.open("http://compendium.ch/mpub/phc/" + medi.Id + "/html", "_blank");
      }
  }

  // add a medication via barcode scan
  else if(values[1] == 'scan'){
    var params = values[2].split("|");
    var reason = params[0];
    var morning = params[1];
    var midday = params[2];
    var evening = params[3];
    var night = params[4];

    this.barcodeService.scanMediCode(this.drugList,morning,midday,evening,night,reason).then((res)=>{

      this.storage.ready().then(()=>{
        this.storage.get('mediPlan').then((res)=>{
          res.Dt = this.drugList[this.drugList.length-1].Pos["0"].DtFrom
          res['Medicaments'] = this.drugList
          this.drugList[this.drugList.length-1].DtFrom
          this.storage.set('mediPlan', res).then(()=>{
            this.barcodeService.doChecksWithCurrentMedication();
          })
          this.storage.set("medicationData", this.drugList);
          var name = res['Medicaments'][res['Medicaments'].length-1].title;
          retVal = name + "erfolgreich hinzugefügt!"

          // edit the ComplianceDataObject

          this.storage.get('ComplianceData').then((res)=>{
            res.DrugList.push({
              "Name":name,
              "Compliance":[]
            })
            this.storage.set('ComplianceData',res)
          })
        })
      })

      })
  }

  // add a medication without barcode scan
  else if(values[1] == 'addmed'){
    var params = values[2].split("|");
    var name = params[0]
    var reason = params[1];
    var morning = params[2];
    var midday = params[3];
    var evening = params[4];
    var night = params[5];

    if(morning=='true')morning=1
    else morning = 0
    if(midday=='true')midday=1
    else midday = 0
    if(evening=='true')evening=1
    else evening = 0
    if(night=='true')night=1
    else night = 0

    // Set the Date of the Medication to Today
    var today:any = new Date();
    var dd:any = today.getDate()
    var mm:any = today.getMonth()+1; //January is 0!
    var yyyy:any = today.getFullYear();
    if(dd<10) {
      dd='0'+dd
    }

    if(mm<10) {
      mm='0'+mm
    }
    today = yyyy+'-'+mm+'-'+dd;
    // Create Object of the Medication
    var tempObj = ({
      "AppInstr":"Arzt oder Apotheker fragen.",
      "TkgRsn":reason,
      "AutoMed":"1",
      "Id":name,
      "IdType":"1",
      "Unit":"",
      "description":name,
      "title":name,
      "PrscbBy":"mir als Patient",
      "Pos":[{
        "D":[
          morning,
          midday,
          evening,
          night
        ],
          "DtFrom":today
        }]
    })
    if(this.drugList==null){
      var newList:any[] = [];
      console.log(newList)
      console.log(tempObj)
      newList.push(tempObj)
      this.drugList = newList
    }
    else{
      var tempList:any = this.drugList;
      tempList.push(tempObj)
    }

    this.storage.ready().then(()=>{
      this.storage.get('mediPlan').then((res)=>{
        res.Dt = today
        res['Medicaments'] = this.drugList
        this.storage.set('mediPlan', res)
        this.storage.set("medicationData", this.drugList);

        // edit the ComplianceDataObject

        this.storage.get('ComplianceData').then((res)=>{
          res.DrugList.push({
            "Name":name,
            "Compliance":[]
          })
          this.storage.set('ComplianceData',res)
        })
      })
    })
  }


  // ask a question with two answering buttons
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



  // persist hausarzt
  else if(values[1] == 'doctor'){
    this.storage.set('doctor', values[2]);
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
}
