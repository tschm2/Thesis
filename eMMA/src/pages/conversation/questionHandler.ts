export class questionHandler {

  messageEMMA_Not_Understand = [
  "Entschuldigung, ich habe dich leider nicht verstanden",
  "Sorry das habe ich verpasst. Bitte stelle eine andere Frage",
  "Diese Frage verstehe ich leider nicht. Kannst du es mit einer Anderen Frage versuchen",
  "Ich Verstehe das leider nicht",
  "Diese Frage kann ich leider nicht beantworten"
  ];
  messageEMMA_Not_Understand_temp = new Array<any>();

  constructor(){
    }
    returnAnswer(question: String):any{
      if(question == "Nahrung"){
        return "Du möchtest etwas über die Nahrung wissen"
      }
      else{
        if(this.messageEMMA_Not_Understand_temp.length == 0){
          this.messageEMMA_Not_Understand_temp = this.messageEMMA_Not_Understand;
        }

        let random = math.random(0, this.messageEMMA_Not_Understand_temp.length);
        let retVal =  this.messageEMMA_Not_Understand_temp.findIndex(random);
        //delet index
        return retVal;

      }

    }
}
