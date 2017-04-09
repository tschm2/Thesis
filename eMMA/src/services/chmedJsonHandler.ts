import { Storage } from '@ionic/storage';
import { HCIService } from './HCIService';

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

  getPatient(medData:JSON): JSON{
    return medData['Patient'];
  }
}
