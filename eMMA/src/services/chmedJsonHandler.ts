import { Storage } from '@ionic/storage';

export class chmedJsonHandler {
    storage:Storage;

    constructor(storage) {
      this.storage = storage;
    }

    getChmedJson():any{
      return this.storage.get('parsedData').then((mediPlan) => {
            return mediPlan;
    })
    }
    getMedicationArray(medData: JSON):JSON{
          return medData['Medicaments'];
      }

    getPatient(medData:JSON): JSON{
            return medData['Patient'];
        }

}
