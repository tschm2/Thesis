import { Storage } from '@ionic/storage';

export class chmedJsonHandler {

    mediPlan:JSON;
    test:String;

    constructor(mediPlan:JSON) {
      this.mediPlan = mediPlan;
    }
    getMedicationArray(): JSON{
      return this.mediPlan['Medicaments'];
        }
    getPatient(): JSON{
        return this.mediPlan['Patient'];
    }
}
