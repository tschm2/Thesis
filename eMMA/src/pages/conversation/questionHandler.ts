import { Storage } from '@ionic/storage';
import { BotService } from '../../services/botService';

export class questionHandler {
  messageEMMA = {
    reminderMorning: "Du möchtest also die Erinnerungsfunktion am Morgen testen.",
    reminderMidday: "Du möchtest also die Erinnerungsfunktion am Mittag testen.",
    reminderEvening: "Du möchtest also die Erinnerungsfunktion am Abend testen.",
    reminderNight: "Du möchtest also die Erinnerungsfunktion in der Nacht testen.",
    deleteStorage: "OOOOPs: ich habe gerade den Speicher gelöscht, Sorry -.-",
    about: "Du möchtest also etwas über eMMA wissen.",
    selfmedication: "Ich öffne die Selbstmedikation für dich.",
    medication: "Ich öffne die Medikationsansicht für dich.",
    compliance: "Gerne zeige ich dir dein Medikationstagebuch an.",
    nutrition: "Ich zeige dir, welche Nahrungsmittel du im Moment nicht essen darfst.",
    informationQuestion: "Wenn du Fragen zu einem Medikament hast, dann gib einfach den Namen ein und die Frage, die du dazu hast. Zum Beispiel Wie, Wann oder Wieso du es einnehmen musst.",
    error: "Hatschi! Entschuldigung, da ist etwas schief gegangen.",
    takingTime: ["morgens um ", "mittags um  ", "abends um ", "in der Nacht um "]
  };

  drugList: JSON;
  takingTime: string[];

  constructor(private storage: Storage, private botService: BotService) {
  }

  // method finds a medicament from this.drugList and returns it as an Object
  // @param name: the name of the medicament to find
  // @return: the medicament as an object. null if not found.
  // @author: hessg1
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
/*the question of the user is analysed and the return value is the answer form eMMA
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

    retVal = this.botService.retrieveBotAnswer(question);


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
        retVal = this.messageEMMA.error;
      }
    else{
      for (var time in medi.Pos[0].D) {
        if (medi.Pos[0].D[time]) {
          retVal = retVal + this.messageEMMA.takingTime[time] + this.takingTime[time] + " Uhr, " + medi.Pos[0].D[time] + " " + medi.Unit + "\n"
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
        retVal = this.messageEMMA.error;
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
      retVal = this.messageEMMA.error;
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
      retVal = this.messageEMMA.error;
    }
    else if (medi.Pos[0].DtFrom && medi.Pos[0].DtTo) {
      retVal += ' Vom ' + medi.Pos[0].DtFrom + " bis zum " + medi.Pos[0].DtTo + '.';
    }
    else {
      retVal = 'Ich habe leider keine konkreten Informationen über die Einnahmedauer von ' + values[2] + ' gespeichert.';
    }
  }

  // this shouldn't be executed
  else{
    console.log('Instruction ' + values[1] + ' not found.');
    retVal = values[2];
  }

}
})

list.push(l2);
return Promise.all(list).then(() => {//get the return value if the calulation is finished
  return retVal
})
}
}
