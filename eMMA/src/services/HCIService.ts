import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

/*----------------------------------------------------------------------------*/
/* barcodeService
/* tschm2
/* This Class is used for the HCI Request
/*----------------------------------------------------------------------------*/
@Injectable()
export class HCIService {
apiURL:string;
url:string;
json:JSON;
http:Http
  constructor() { }

  /*----------------------------------------------------------------------------*/
  /* This Method is used to Query a Medication and get the HCISolutions Informatin
  /*----------------------------------------------------------------------------*/
  hciquery(aKey: string, aKeyType: string): Promise<any> {
    var key = aKey; // queried barcode
    var index = 'hospINDEX'; // TODO: Default
    var keyType = aKeyType; // TODO: Default
    let p = new Promise(function(resolve,reject){
      var username = 'EPN236342@hcisolutions.ch';
      var password = 'UMPbDJu7!W';

      var xhr = new XMLHttpRequest(),
      method = "GET",
      url = `https://index.hcisolutions.ch/index/current/get.aspx?schema=ARTICLE&keytype=${keyType}&key=${key}&index=${index}`;
      //url = "https://index.hcisolutions.ch/index/current/get.aspx?schema=ARTICLE&keytype=phar&key=3365788&index=hospINDEX";
      xhr.open(method, url, true);
      var reqHeader = {'Authorization': 'Basic ' + btoa(`${username}:${password}`)};

      if (reqHeader) {
        Object.keys(reqHeader).forEach((key) => {
          xhr.setRequestHeader(key, reqHeader[key]);
        });
      }
      xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { //<- debugging
          // alert(url + "\nstatus: " + xhr.status); // <- debugging
          resolve(xhr.responseXML);
        } else {
          console.log("Error!");
          reject(); // added hessg1 3.3.
        }
      };

      xhr.send();
    });

    return p;
    }
  }
