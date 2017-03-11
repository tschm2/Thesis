export class chmedJsonHandler {
    mediPlan: JSON;
    constructor(mediPlan: string) {
      this.mediPlan = JSON.parse(mediPlan);
    }
    getMedicationArray(): JSON{
        return this.mediPlan['Medicaments'];
    }
    getPatient(): JSON{
        return this.mediPlan['Patient'];
    }
}
