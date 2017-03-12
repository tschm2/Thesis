import {RequestOptions, Request, RequestMethod,Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

export class barcodeService {
apiURL:string;
http:Http;
url:string;
      constructor(storage: Storage, http:Http) {
        this.http = http;
        this.url = "https://int.hcisolutions.ch/MedicationActiveForm/cds/check";
      }
//Post JSON in Angular 2


      POST(url, data) {

        let test_this = { "search": "person" };
        let headers2 = new Headers ({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers, method: "post" });

        this.http.post(this.url, test_this, options)



        var headers = new Headers(), authtoken = localStorage.getItem('authtoken');
        headers.append("Content-Type", 'application/json');

        if (authtoken) {
        headers.append("Authorization", 'Token ' + authtoken)
        }
        headers.append("Accept", 'application/json');

        var requestoptions = new RequestOptions({
            method: RequestMethod.Post,
            url: this.apiURL + url,
            headers: headers,
            body: data
        })


        return this.http.request(new Request(requestoptions))
        .map((res: Response) => {
            if (res) {
                return { status: res.status, json: res.json() }
            }
        });
    }


        /*  createAuthorizationHeader(headers: Headers) {
            headers.append('Authorization', 'Basic ' +
              btoa('username:password'));
          }
          get(url) {
          let headers = new Headers();
          this.createAuthorizationHeader(headers);
          return this.http.get(url, {
            headers: headers
          });
          }

          post(url, data) {
          let headers = new Headers();
          this.createAuthorizationHeader(headers);
          return this.http.post(url, data, {
            headers: headers
          });
        }*/
}
