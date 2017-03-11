declare module chmedInterface {

    export interface TT {
        DoFrom: number;
    }

    export interface Pos {
        D: number[];
        DtFrom: string;
        DtTo: string;
        InRes?: number;
        TT: TT[];
    }

    export interface Medicament {
        AppInstr: string;
        Id: string;
        IdType: number;
        Pos: Pos[];
        PrscbBy: string;
        Roa: string;
        TkgRsn: string;
        Unit: string;
        AutoMed?: number;
    }

    export interface Mea {
        Type: number;
        Unit: number;
        Val: string;
    }

    export interface Rc {
        Id: number;
        R: number[];
    }

    export interface Med {
        DLstMen: string;
        Meas: Mea[];
        Rc: Rc[];
    }

    export interface Patient {
        BDt: string;
        City: string;
        FName: string;
        Gender: number;
        LName: string;
        Lng: string;
        Med: Med;
        Phone: string;
        Street: string;
        Zip: string;
    }

    export interface RootObject {
        Auth: string;
        Dt: Date;
        Id: string;
        MedType: number;
        Medicaments: Medicament[];
        Patient: Patient;
        Rmk: string;
    }

}
