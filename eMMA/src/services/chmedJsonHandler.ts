import { Storage } from '@ionic/storage';
import { HCIService } from './HCIService';
import myPako from "../../node_modules/pako"

/*----------------------------------------------------------------------------*/
/* chmedJsonHandler
/* tschm2
/* This Class is there to handle the Json of the eMediplan
/* It's used to get and set different elements in the whole eMediplan
/* Furthermore it has Functions to add and remove the Medication Entrys
/*----------------------------------------------------------------------------*/

  export class chmedJsonHandler {
  storage:Storage;
  hciS:any;

    /**
       * @param  {Storage}               publicstorage    ionic storage from phone
     */
  constructor(storage) {
    this.hciS = new HCIService();
    this.storage = storage;
  }
  /*----------------------------------------------------------------------------*/
  /* Getter for the whole eMediplan
  /* Returns the eMediplan JSON
  /*----------------------------------------------------------------------------*/
    getChmedJson():any{
    return this.storage.get('mediPlan').then((mediPlan) => {
      return mediPlan;
    })
  }

  /*----------------------------------------------------------------------------*/
  /* Getter for the Medication
  /* Returns the MedicationJson
  /*----------------------------------------------------------------------------*/
  getMedicationArray(medData: JSON):JSON{
    var i = 0
    for (let medi of medData['Medicaments']){

    // The function getHCIData is used to get the Full Name of the Medication istead of the ID

    this.hciS.getHCIData(medi.Id,"phar").then(function(response) {
      if(Number(medi.Id)){
        var result = JSON.parse(response._body);
        var desc = result.article[0].dscrd;
        var title = desc.split(" ")[0];
        medData['Medicaments'][i].description = desc
        medData['Medicaments'][i].title = title
      }
      else{
        medData['Medicaments'][i].description = medi.Id
        medData['Medicaments'][i].title = medi.Id
      }
      i++
    })
    }
    return medData['Medicaments'];
  }

  /*----------------------------------------------------------------------------*/
  /* This Method is used to Delete the Selfmedication from the MedcationArray
  /* Returns the MedicationArray
  /*----------------------------------------------------------------------------*/
  deleteDrugFromArray(drugList,id):any{
  var tempList = new Array();
  for(var k in drugList) {
    if(drugList[k].Id != id){
      var tempDrug = (drugList[k])
      tempList.push(tempDrug)
    }
  }
  return tempList;
  }

  /*----------------------------------------------------------------------------*/
  /* Getter for the Patient Object
  /*----------------------------------------------------------------------------*/
  getPatient(){
    this.storage.get("mediPlan").then((res) => {
      return res['Patient']
    })
  }

  /*----------------------------------------------------------------------------*/
  /* Setter for the Firstname of the Patient
  /*----------------------------------------------------------------------------*/
  setPatientFName(name){
  this.storage.get("mediPlan").then((res) => {
    res['Patient'].FName = name
    this.storage.set('mediPlan', res)
    })
  }

  /*----------------------------------------------------------------------------*/
  /* Setter for the "athletic" Flag in the eMedication Plan
  /*----------------------------------------------------------------------------*/
  setAthletic(){
  this.storage.get('mediPlan').then((result) => {
    let temp = result
    var athletic = {
      Id: 4,
      R: <any>[]
    }
    athletic.R.push(580)
    temp['Patient'].Med['Rc']["3"] = athletic
    this.storage.set('mediPlan', "tempMediplan").then(()=>{
      this.storage.set('mediPlan', temp)
    })
  })
  }

  /*----------------------------------------------------------------------------*/
  /* Getter for the CHMED16 String of the current eMediplan
  /*----------------------------------------------------------------------------*/
  getCHMEDString():any{
  return this.storage.get("mediPlan").then((res) => {
  var strData2 = JSON.stringify(res)
  var data2 = strData2.split ('').map (function (c) { return c.charCodeAt (0); })
  var str = myPako.gzip(data2, { to: 'string' })
  var b64Data = btoa(str)
  var chmed16 = "CHMED16A1"+b64Data;
  return chmed16
  })
  }

  /*----------------------------------------------------------------------------*/
  // Method to Decode the CHMED16 String
  /*----------------------------------------------------------------------------*/
  chmedToString(chmed16):string{
    console.log(chmed16)
    var b64Data  =   chmed16.substring(9);
    // Decode base64 (convert ascii to binary)
    var stData     = atob(b64Data);
    // Convert binary string to character-number array
    var charData    = stData.split('').map(function(x){return x.charCodeAt(0);});
    // Turn number array into byte-array
    var binData     = new Uint8Array(charData);
    // Pako magic
    var data        = myPako.inflate(binData);
    // Convert gunzipped byteArray back to ascii string:
    let strData: string  = String.fromCharCode.apply(null, new Uint16Array(data));
    strData = this.convert_accented_characters(strData)
    return strData
  }

  /*----------------------------------------------------------------------------*/
  // If the Patient has no Medicationplan and no Access to a EHR
  // This Method saves an Dummy Mediplan to allow the user to work with the application!
  /*----------------------------------------------------------------------------*/
  saveEmptyMedicationplan(){
    let mediPlanString = "CHMED16A1H4sIAAAAAAAAAzWPzU7DMBCE32WvxGjt/LTxCWgAITUIlZ6KekjsTROhhqpxEFWUd2eTyLdvxrM76wEee1eDhs71llrXPZRVfW9qCCBzbCuUK4GxwHQvUWOoMblDpRE58GY5EK9DSaqSIrQmFVFRWlEarMR6FcsqDUlRYjmbk93fLgRaztyY4jy1gf46BvBRuIYV6AGefCtXRgIlj24ad2OP6eWdpxjz4o/VK7WWrqAxgK1/6DvHFhvtiWX2vDRPi7Nt53Jql0U7w8XD/AE5BgsoD5GH2EMyHke+sv5pyc//MkzHfborkVvcQ3OZgKO78/dM/z1VXKpeAQAA";
    console.log(mediPlanString);
    mediPlanString = this.chmedToString(mediPlanString)
    this.storage.ready().then(() => {
      var mediPlan = JSON.parse(mediPlanString)
      this.storage.set("mediPlan", mediPlan).then(()=>{
        console.log("FERTIG");
      })
    })
  }

  /*----------------------------------------------------------------------------*/
  // The Pako Library has converting Errors for the Characters ö ü ä Ö Ü Ä
  // There fore the Letters getting in the whole eMediplan will get replaced!
  /*----------------------------------------------------------------------------*/
  convert_accented_characters(str){
  var conversions = new Object();
    conversions['ue'] = 'Ã¼|ï¿½';
    conversions['ae'] = 'Ã¤';
    conversions['oe'] = 'Ã¶';
    conversions['Oe'] = 'Ã';
    conversions['Ue'] = 'Ã';
    conversions['Ae'] = 'Ã';
    for(var i in conversions){
      var re = new RegExp(conversions[i],"g");
    str = str.replace(re,i);
    }
    return str;
  }
}
