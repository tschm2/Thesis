  export type HttpMethod =
    'POST' |
    'PUT' |
    'GET' |
    'DELETE' ;

export interface ApiCallArgs {
    url: string;
    method: HttpMethod;
    headers?: any;
    payload?: any;
    jsonBody?: boolean;
}
;

export type imageType =
    'FRONT' |
    'BACK' |
    'DETAILFRONT' |
    'DETAILBACK' |
    'ALL';

export type grouping =
    'byProduct' |
    'byCheck';

export type extent =
    'compact' |
    'full';

export type checkType =
    'allergySubstance' |
    'allergyExcipient' |
    'doping' |
    'doubleMedication' |
    'elderly' |
    'interaction' |
    'interactionFlycicleCH' |
    'liverInsufficiency' |
    'nutrition' |
    'posology' |
    'reproduction' |
    'renalInsufficiency';


export interface check {
    check?: checkType, // Default / if empty or missing: error
    hideAbove?: number
}

export interface hciCdsCheckRequest {
    medication: string,
    extent?: extent,
    grouping?: grouping,
    checks: check[]
}


export interface hciQueryRequest {
    key: string;
    index?: string;
    keyType?: string;
}
