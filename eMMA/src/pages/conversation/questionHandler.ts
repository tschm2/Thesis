import { Storage } from '@ionic/storage';
import { BotService } from '../../services/botService';

export class questionHandler {
  messageEMMA_Reminder_Morning = "Du möchtest also die Erinnerungsfunktion am Morgen testen"
  messageEMMA_Reminder_Midday = "Du möchtest also die Erinnerungsfunktion am Mittag testen"
  messageEMMA_Reminder_Evening = "Du möchtest also die Erinnerungsfunktion am Abend testen"
  messageEMMA_Reminder_Night = "Du möchtest also die Erinnerungsfunktion in der Nacht testen"
  messageEMMA_Delete_Storage = "OOOOPs: ich habe gerade den Speicher gelöscht, Sorry -.-"
  messageEMMA_About = "Du möchtest also etwas über eMMA wissen."
  messageEMMA_Selfmedication = "Ich öffne die Selbstmedikation für dich"
  messageEMMA_Medication = "Ich öffne die Medikationsansicht für dich"
  messageEMMA_Compliance = "Gerne zeige ich dir dein Medikationstagebuch an"
  messageEMMA_Nutrition = "Ich zeige dir, welche Nahrungsmittel du im Moment nicht essen darfst."
  messageEMMA_InformationQuestion = "Wenn du Fragen zu einem Medikament hast, dann gib einfach den Namen ein + die Frage die du hast. Zum Beispiel Wie, Wann oder Wieso du es einnehmen musst."
  messageEMMA_TooMuchInformation = "Huch, das war etwas viel auf Einmal. Bitte versuche es mit einer kürzeren Frage"


  messageEMMA_Not_Understand = [
    "Entschuldigung, ich habe dich leider nicht verstanden",
    "Sorry das habe ich verpasst. Bitte stelle eine andere Frage",
    "Diese Frage verstehe ich leider nicht. Kannst du es mit einer anderen Frage versuchen",
    "Ich verstehe das leider nicht",
    "Diese Frage kann ich leider nicht beantworten"
  ];
  messageEMMA_Not_Understand_temp = new Array<any>();
  messageEMMA_TakingTime = ["morgens um ", "mittags um  ", "abends um ", "In der Nacht um "
  ];

  drugList: JSON;
  takingTime: string[];

  constructor(private storage: Storage, private botService: BotService) {
  }

  /*----------------------------------------------------------------------------*/
  /* This Methode handels the user input for the question Methode
  /*
  /*the question of the user is analysed and the return value is the awnser form eMMA
  /*----------------------------------------------------------------------------*/
  returnAnswer(question: string): any {
    var retVal: any = "";
    var list = new Array<any>()
    question = question.toUpperCase();
    //return
    var l = this.storage.get('takingTime').then((takingtimes) => {
      this.takingTime = takingtimes;
      //return getMediDataFromStorage
    })
    list.push(l) //raus
    /*Ab it function und return not var*/
    var l2 = this.storage.get('medicationData').then((res) => {
      this.drugList = res;

      for (var pos in this.drugList) {  //stepp thorught every drug in drug list
        if (question.includes(this.drugList[pos].title)) {  //if the question includes a medicaitons name

          if (question.includes("WANN") || question.includes("ZEIT") || question.includes("UHR")) {//check if the user whatns to now soemting about the time
            retVal = retVal + "Du solltest " + this.drugList[pos].title + " an folgenden Uhrzeiten einnehmen:\n"
            for (var time in this.drugList[pos].Pos[0].D) {
              if (this.drugList[pos].Pos[0].D[time]) {
                retVal = retVal + this.messageEMMA_TakingTime[time] + this.takingTime[time] + "Uhr, " + this.drugList[pos].Pos[0].D[time] + " " + this.drugList[pos].Unit + "\n"
              }
            }
            //if the app insturctio has someting to do with "Essen" this information is also given to the user
            if (this.drugList[pos].AppInstr && this.drugList[pos].AppInstr.includes("Essen")) {
              retVal = retVal + "jeweils" + this.drugList[pos].AppInstr + "\n"
            }
          }
          //if the user wants to know about his apply intstruction
          if ((question.includes("WIE ") && !question.includes("LANGE")) || question.includes("EINNAHME")) {
            if (this.drugList[pos].AppInstr) {
              retVal = retVal + "Du solltest " + this.drugList[pos].title + " " + this.drugList[pos].AppInstr + " einnehmen\n";
            }
            else {
              retVal = retVal + "Ich habe leider keine Informationen über die Einnahme von " + this.drugList[pos].title + "\n";
            }
          }
          //if the suer wants to know the reason why he shoudl take his drug
          if (question.includes("WIESO") || question.includes("GRUND")) {
            if (this.drugList[pos].TkgRsn) {
              retVal = retVal + "Als Grund für die Einnahme von " + this.drugList[pos].title + " habe ich " + this.drugList[pos].TkgRsn + " eingetragen\n";
            }
            else {
              retVal = retVal + "Ich habe leider keine Informationen über den Grund der einnahme von " + this.drugList[pos].title; "\n" + "soll ich für dich Googeln?\n"
            }
          }
          //if the user wants to knwo someting about the taking duration of his drugs
          if (question.includes("LANGE") || question.includes("DAUER")) {
            if (this.drugList[pos].Pos[0].DtFrom && this.drugList[pos].Pos[0].DtTo) {
              retVal = retVal + "Du solltest " + this.drugList[pos].title + " an folgenden Daten einnehmen:\n" + "vom: " + this.drugList[pos].Pos[0].DtFrom + " bis " + this.drugList[pos].Pos[0].DtTo + "\n";
            }
            else {
              retVal = retVal + "Ich habe leider keine Informationen über die Einnahmedauer von: " + this.drugList[pos].title + "\n";
            }
          }
          //if knwo possible awnser was found about this drug
          if (retVal == "") {
            retVal = retVal + "Was möchtest du über " + this.drugList[pos].title + " wissen?"
          }
        }
      }
      // if (question === "?") {//if the user writes onyl an ?, give him information what he can ask
      //   retVal = this.messageEMMA_InformationQuestion
      // }
      // else
     if (question.length > 200) {//if there is too mutch information in the question
        retVal = this.messageEMMA_TooMuchInformation
      }
      else if (retVal == "") {//if tthe return value is still empty
        // if (question.includes("NAHRUNG") || (question.includes("ESSEN") && question.includes("NICHT"))) {
        //   retVal = this.messageEMMA_Nutrition;
        // }
        // else if (question.includes("SELBSTMEDIKATION") || (question.includes("MEDIKAMENT") && (question.includes("ZUSÄTZLICH") || (question.includes("ERFASSEN"))))) {
        //   retVal = this.messageEMMA_Selfmedication;
        // }
        // else if (question.includes("MEINE") && (question.includes("MEDI"))) {
        //   retVal = this.messageEMMA_Medication;
        // }
        // else if (question.includes("REMINDER")) {
        // if (question.includes("REMINDER")) {
        //   if (question.includes("NACHT")) {
        //     retVal = this.messageEMMA_Reminder_Night
        //   }
        //   else if (question.includes("MITTAG")) {
        //     retVal = this.messageEMMA_Reminder_Midday
        //   }
        //   else if (question.includes("ABEND")) {
        //     retVal = this.messageEMMA_Reminder_Evening
        //   } else {
        //     retVal = this.messageEMMA_Reminder_Morning
        //   }
        // }
        // else if (question.includes("ÜBER")) {
        //   retVal = this.messageEMMA_About
        // }
        // else if (question.includes("DELETE")) {
        //   retVal = this.messageEMMA_Delete_Storage;
        // }
      //   else if (question.includes("AUSWERTUNG") || (question.includes("WELCHE") && question.includes("NICHT") && question.includes("EINGENOMMEN"))) {
      //     retVal = this.messageEMMA_Compliance;
      //   }
      //   else if (question.includes("HALLO") || question.includes("HUHU") || question.includes("GUGUS")) {
      //     retVal = "Hallo, was möchtest du wissen?"
      //   }
      //   else if (question.includes("WER") && question.includes("DU")) {
      //     retVal = "Ich bin eMMA. Deine Persöhliche elektronische Medikations Management Assistentin"
      //   }
      //   else if (question.includes("BEREITS") && question.includes("GENOMMEN")) {
      //     retVal = "Ich verstehe. Ich werde dich also an die nächste Medikation nicht erinnern"
      //   }
      //   else if (question.includes("OK") || question.includes("DANKE") || question.includes("SUPER") || question.includes("TOLL")) {
      //     retVal = "Freut mich, dass ich dir helfen konnte"
	  	// }
		//  if ((question.includes("ICH HEISSE") || question.includes("MEIN NAME IST") || question.includes("NENNE MICH")) && !question.includes("WIE")) {
		//   retVal = this.botService.retrieveBotAnswer(question);
		//   this.storage.set('name', this.botService.getUservar('name'));
		// }
        // else { //if no possible answer is found
          retVal = this.botService.retrieveBotAnswer(question);
        // }
        if(retVal.includes('inst#')){
          var values = retVal.split("#");
          // doing interpretation of given instructions
          if(values[1] == 'name'){
            this.storage.set('name', values[2]);
            retVal = values[3];
          }
          else{
            console.log(values[1]);
            console.log(values[2]);
            retVal = values[2];
          }

        }
      }
    })

    list.push(l2)
    return Promise.all(list).then(() => {//get the retun value if the calulation is finished
      return retVal
    })

  }

}
