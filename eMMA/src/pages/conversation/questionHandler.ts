import { Storage } from '@ionic/storage';

export class questionHandler {

  messageEMMA_Not_Understand = [
  "Entschuldigung, ich habe dich leider nicht verstanden",
  "Sorry das habe ich verpasst. Bitte stelle eine andere Frage",
  "Diese Frage verstehe ich leider nicht. Kannst du es mit einer Anderen Frage versuchen",
  "Ich Verstehe das leider nicht",
  "Diese Frage kann ich leider nicht beantworten"
  ];
  messageEMMA_Not_Understand_temp = new Array<any>();
  messageEMMA_TakingTime = [ "Morgnes um ", "Mittag um  ", "Abends um ", "In der Nacht um "
  ];

  drugList:JSON;
  takingTime:String[];
  constructor(private storage:Storage){

    }
    returnAnswer(question: String):any{
      let retVal = "";
      question = question.toUpperCase();
      this.storage.ready().then(()=>{
        this.storage.get('takingTime').then((takingtimes)=>{
          this.takingTime = takingtimes;
          this.storage.get('medicationData').then((res)=>{
            this.drugList = res;
            console.log(this.drugList)
            for(var pos in this.drugList){
              if(question.includes(this.drugList[pos].title)){

                if(question.includes("WANN")||question.includes("ZEIT")||question.includes("UHR")){
                  retVal = retVal + "du solltest " + this.drugList[pos].title +" an folgenden Uhrzeiten einnehmen:\n"
                  for(var time in this.drugList[pos].Pos[0].D){
                    console.log(this.drugList[pos].Pos[0].D[time])
                    if(this.drugList[pos].Pos[0].D[time]){
                      retVal = retVal + this.messageEMMA_TakingTime[time]  + this.takingTime[time] + "Uhr, " + this.drugList[pos].Pos[0].D[time] + " "+ this.drugList[pos].Unit + "\n"
                    }
                  }
                  if(this.drugList[pos].AppInstr && this.drugList[pos].AppInstr.includes("Essen")){
                    retVal = retVal + "jeweils" + this.drugList[pos].AppInstr + "\n"
                  }
                }
                if((question.includes("WIE")&& !question.includes("LANGE"))||question.includes("EINNAHME")){
                  if(this.drugList[pos].AppInstr){
                      retVal = retVal + "Du solltest " + this.drugList[pos].title + " " + this.drugList[pos].AppInstr  + " einnehmen\n";
                  }
                  else{
                    retVal = retVal + "Ich habe leider keine Informationen über die Einnahme von " + this.drugList[pos].title + "\n";
                  }
                }
                if(question.includes("WIESO")||question.includes("GRUND")){
                  if(this.drugList[pos].TkgRsn){
                    retVal = retVal + "Als Anwendungsgrund von  " + this.drugList[pos].title + " habe ich " + this.drugList[pos].TkgRsn  + " eingetragen\n";
                  }
                  else{
                    retVal = retVal + "Ich habe leider keine Informationen über den Grund der einnahme von " + this.drugList[pos].title; "\n" + "soll ich für dich Googeln?\n"
                  }
                }
                if(question.includes("LANGE")||question.includes("DAUER")){
                  if(this.drugList[pos].Pos[0].DtFrom && this.drugList[pos].Pos[0].DtTo){
                    retVal = retVal + "Du solltes" + this.drugList[pos].title + "an folgendne Daten einnehmen:\n" + "vom: " + this.drugList[pos].Pos[0].DtFrom + " bis " + this.drugList[pos].Pos[0].DtTo +"\n";
                  }
                  else{
                    retVal = retVal + "Ich habe leider keine Informationen über die Einnahmedauer von: " + this.drugList[pos].title + "\n";
                  }
                }
                if(retVal == ""){
                  retVal = retVal + "Was möchtest du über " + this.drugList[pos].title + " wissen?"
                }
              }
            }
            console.log(retVal)
            if(retVal == ""){
              if(question.includes("NAHRUNG")||(question.includes("ESSEN")&&question.includes("NICHT"))){
                retVal =  "Folgende dinge darfts du zu deiner aktuellen Medikation nicht essen\n"
              }
              else{
                if(this.messageEMMA_Not_Understand_temp.length == 0){
                  for (var name in this.messageEMMA_Not_Understand) {
                    this.messageEMMA_Not_Understand_temp[name] = this.messageEMMA_Not_Understand[name];
                  }
                }
                let random = Math.random()*this.messageEMMA_Not_Understand_temp.length;
                let retVal2 =  this.messageEMMA_Not_Understand_temp.splice(random,1)
                console.log(retVal2)
                return  retVal2;

              }
            }
            return retVal

            })
          })
        })
      }
}
