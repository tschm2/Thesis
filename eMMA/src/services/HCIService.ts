import {Request, RequestMethod,Response} from '@angular/http';
import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import myPako from "../../node_modules/pako"
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';

export class HCIService {
apiURL:string;
url:string;
json:JSON;
http:Http
  constructor() { }

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
      xhr.open(method, url, true);
      var reqHeader = {'Authorization': 'Basic ' + btoa(`${username}:${password}`)};

      if (reqHeader) {
        Object.keys(reqHeader).forEach((key) => {
          xhr.setRequestHeader(key, reqHeader[key]);
        });
      }
      xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          resolve(xhr.responseXML);
        } else {
          console.log("Error!");
        }
      };

      xhr.send();
    });

    return p;
    }

  //testDummyData
   getHCIData(http,id,keyT):any {
      // preparing variables
      var api = 'http://www.laettere.ch/carole/mina/getArticle.php';
      //console.log(api);
      var keytype = keyT
      //console.log(keytype);
      var key = id;
      //console.log(key);
      var index = 'hospINDEX';
      //console.log(index);

      // concat uri
      var uri = api + '?keytype=' + keytype + '&key=' + key + '&index=' + index;

      return http.get(uri).toPromise().then(function(response){
        return response;
      });
    }
  }
