import { Storage } from '@ionic/storage';
import { HCIService } from './HCIService';
import myPako from "../../node_modules/pako"

export class chmedJsonHandler {
  storage:Storage;
  hciS:any;

  constructor(storage) {
    this.hciS = new HCIService();
    this.storage = storage;
  }

  getChmedJson():any{
    return this.storage.get('mediPlan').then((mediPlan) => {
      return mediPlan;
    })
  }

  getMedicationArray(medData: JSON):JSON{
    var i = 0
    for (let medi of medData['Medicaments']){
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

  getPatient(){
   this.storage.get("mediPlan").then((res) => {
      return res['Patient']
    })
  }
  setPatientFName(name){
   this.storage.get("mediPlan").then((res) => {
      res['Patient'].FName = name
      this.storage.set('mediPlan', res)
    })
  }
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

  chmedToString(chmed16):string{
      var b64Data  =   chmed16.text.substring(9);
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

  saveEmptyMedicationplan(){
    var mediPlanString:String = "CHMED16A1H4sIAAAAAAAAAzWPzU7DMBCE32WvxGjt/LTxCWgAITUIlZ6KekjsTROhhqpxEFWUd2eTyLdvxrM76wEee1eDhs71llrXPZRVfW9qCCBzbCuUK4GxwHQvUWOoMblDpRE58GY5EK9DSaqSIrQmFVFRWlEarMR6FcsqDUlRYjmbk93fLgRaztyY4jy1gf46BvBRuIYV6AGefCtXRgIlj24ad2OP6eWdpxjz4o/VK7WWrqAxgK1/6DvHFhvtiWX2vDRPi7Nt53Jql0U7w8XD/AE5BgsoD5GH2EMyHke+sv5pyc//MkzHfborkVvcQ3OZgKO78/dM/z1VXKpeAQAA";
    mediPlanString = this.chmedToString(mediPlanString)
    this.storage.ready().then(() => {
      var mediPlan = JSON.parse(mediPlan)
      this.storage.set("mediPlan", mediPlan)
  })
}

  convert_accented_characters(str){
   var conversions = new Object();
   conversions['ü'] = 'Ã¼|ï¿½';
   conversions['ä'] = 'Ã¤';
   conversions['ö'] = 'Ã¶';
   conversions['Ö'] = 'Ã';
   conversions['Ü'] = 'Ã';
   conversions['Ä'] = 'Ã';
   for(var i in conversions){
       var re = new RegExp(conversions[i],"g");
       str = str.replace(re,i);
   }

   return str;
}
}
