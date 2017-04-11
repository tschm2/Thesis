import { BarcodeScanner } from 'ionic-native';
import myPako from "../../node_modules/pako"
import { Storage } from '@ionic/storage';
import { HCIService } from './HCIService';
import { Http, Headers, RequestOptions } from '@angular/http';

export class barcodeService {
private list: Array<any>;

  constructor(public http: Http, public storage: Storage) {

  }

  scanQRcodeForJSON():any{

    BarcodeScanner.scan().then((barcodeData) => {
      var b64Data  =   barcodeData.text.substring(9);
      // Decode base64 (convert ascii to binary)
      var strData     = atob(b64Data);
      // Convert binary string to character-number array
      var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
      // Turn number array into byte-array
      var binData     = new Uint8Array(charData);
      // Pako magic
      var data        = myPako.inflate(binData);
      // Convert gunzipped byteArray back to ascii string:
      let strData2: string  = String.fromCharCode.apply(null, new Uint16Array(data));

      this.storage.ready().then(() => {

        var mediPlan = JSON.parse(strData2)
        this.storage.set("mediPlan", mediPlan);
      this.IdHCIQuery(mediPlan).then((res) => {

          this.storage.set("medicationData", res);
      });
      return true;
      })

      // Success! Barcode data is here
    }, (err) => {
      alert("Woops falscher QR-Code, zu Testzwecken wurde DummyData gespeichert");
      this.testDummyData()
      return false;
    })
  }

  IdHCIQuery(medData){
    this.list = new Array<any>();
    var hciS = new HCIService();
    for (let medi of medData['Medicaments']){
      if(Number(medi.Id)){
        var l = hciS.hciquery(medi.Id,"phar").then((responseXML)=>{
          var xml =  responseXML;
          var art = xml.getElementsByTagName("ART");
          var desc = art[0].getElementsByTagName("DSCRD")[0].textContent
          var title = desc.split(" ")[0];
          medi.description = desc
          medi.title = title
        });
      }
      else{
        medi.description = medi.Id
        medi.title = medi.Id
      }
      this.list.push(l)
    }

    return Promise.all(this.list).then((res) => {
      return(medData['Medicaments']);
    });
  }


  scanMediCode(medData){
    var hciS = new HCIService()
    BarcodeScanner.scan().then((barcodeData) => {
      hciS.hciquery(barcodeData.text,"ARTBAR").then(function(response) {
        var xml =  response;
        var art = xml.getElementsByTagName("ART");
        var desc = art[0].getElementsByTagName("DSCRD")[0].textContent
        var title = desc.split(" ")[0];
        var tempObj = ({
          "AppInstr":"Arzt oder Apotheker fragen.",
          "AutoMed":"1",
          "Id":art[0].getElementsByTagName("PHAR")[0].textContent,
          "IdType":"3",
          "description":desc,
          "title":title,
          "PrscbBy":"mir als Patient",
          "Pos":[{
            "D":[
              0,
              0,
              0,
              0
            ],
            "DtFrom":"TodaysDate"
          }]
        })
        medData.push(tempObj)

        this.storage.ready().then(()=>{
          this.storage.get('mediPlan').then((res)=>{
            res['Medicaments'] = medData
            this.storage.set('mediPlan', res)
            this.storage.set("medicationData", medData);
          })
        })
      })
      }, (err) => {
        console.log(err)
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


/* To Be Deleted */

        testThisNow(chmed){
          var testData = "CHMED16A1eJytVM1u2kAQfpWNr7GjXduAzS0JoUUJLSK0kVrlsLYHvMJeo/W6TUC8TR6jt7xYZ+04JQFyqoTxeGd25ptvfjbWeaVTq2/1upRR6rnUDzs9y7YGGg9dyroOow4LZizoM6/veafU7VOKBqMEDSLfm4fdaO7488B1fAgjJ+RR4IQxjefBPOjw0DgbQzJ7XIHVZ7UsYp6D1KXV/7mxzlerkSy1Qm+SxylJICdXZQmyjeH7IWNeE7Lx4tnWpGhuD/Cf2dTG596AHqoib4HTEH91KrNi54yF1hZtJ6qMo4tHVAzUGflSaDJUXK5t86pAziFL8O604Ggx+YribLmYlhK/RqhcalEYhN+kMETdzq6trb1pALsBo17X/xgwPQTYcyg7AO5crTX5zGVpk/HzHxmnIFNeNRQdAniRYU2LOE1UFS+PgGSh2/PdD1ilx1j9TyAv0yKDUoMSEo2WoPaB7rZGpYg4y89sYqSkUtgpwugqAUoDmYAqCwnypO0al7HA946n5x6sQcdhDDM8kN7VA89XGZBrrjKb3D0/yYV4zWw0fkM/qCoVi0ou/qU0vnmfUQSCXEDC1RytcAgLHIx6QGr4OAFi8VvES8h2cmD7JTrYRy+NP5JTQGtmsnlFNxQQ7ZLt7AETJVlXJOcPZ8THV0b089MiE8g4IzMeZaCRcBBSQprX5d1D7/e6HvN6R9j/ECsinTVmRWNGt/dvq/F+Ux1qrtsYoak1vB9R44hrgcvH6m+si3rJsdD36rIzNL4U2sS441liMtZNEYdfcGGZIKBr6j6BTFAwaG9eVOOqbHQ3eANb5qpZeybM4KbUYzCw6jPe0PBa0Qafa1vfeYY2AasL0qjdVs1aNQtoncY0rr2MGtan+NHp9e7b8XZbwWsFvxU6rdBtrzEkeIvEpDhAGOHUZ6QXEuZ6xO+QrqH4VisA3bT2AruE434mzGy4H2KFx6Eb4lJFf/nS5A6KvLBMRKnJryInZusvuVma5SrjkkSwAGEY0yfW9i+0wN/G"

          var b64Data  =   testData.substring(9);

          // Decode base64 (convert ascii to binary)
          var strData     = atob(b64Data);

          // Convert binary string to character-number array
          var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});

          // Turn number array into byte-array
          var binData     = new Uint8Array(charData);

          // Pako magic makeing
          var data        = myPako.inflate(binData);

          // Convert gunzipped byteArray back to ascii string:


          let strData2: string  = String.fromCharCode.apply(null, new Uint16Array(data));


            var mediPlan = JSON.parse(strData2)
            console.log("PLEASE")
            console.log(mediPlan)



  }


  analyseCHMED(){
    var testData = "CHMED16A1H4sIAAAAAAAAA61VzXLiOBB+lR5fxxBJNmBzIyHZdQ0ECjyZqt3KQRgBWmyZkuWpmaTyNvMYc8s77XlbVpwwWZK9bBXGbfWP9H39uX3vjWqz84beoE8oIQEjYdwbeL43NrjICO13KOnQKKXRkAbDIPhI2JAQDEjWGLAKg03cX2064SZinVDEq07MV1Enzki2iTZRj8e22FSs0+8H4Q1pY8uMF0KZyhv+ee+NDodEVUZjNcWzHaxFAZdVJVS7RxjGlAZuS1cl8L156bLH+E994uN1aw99pcuiPTiJ8ddAScujNRp7Dxg711W2Ov+OjrHuwnVp4EpzdefbWy3URuRrzF2UHCPmMzTT/XZRKXxK0Lk3srQn/KykJWqZfsKHtagyLQ+Na+idjy7SRTKFTamNgJSvcogIOaN9UmyBEliaPeYYaXLxEu09+PcONosoCfrh+7DJKdhBh9ATEEf6zsDvXFU+TB9/qmwn1I7XjuhTMM9zVEaZ7da6zvbvQ72YdcbJ7GZ0DVcyL4yFijDPKOv2AMGy6BXY5/gXuDRmg5C902XyVpf/J7gXuzIXlRFaKgzaC/0+5OVskSbLF7yMWKTB67a6sAbmsdBrDbJbdH2w1rrWqHtpfbUUVixzoatSCfWhfQcYpVEYvE0OO6mFXodS5OcEOZffeHHIBXziOvfhy+MPtZXPvKAKj2UgdL2T21ptXwiZTv7Fx81oknyeQqL+gsnfldV3sT1jRd7gPJPdr13owag4AIMiPyLI5SFBqs7zX1layQruaij4ty6EeMvBPP7Y5hLJos37JAxyJaRSYlc0fcVZVuJ8aeaMmx2DfkCDwRvEnZwWiVqIqqmQpi6sdGHk4fZXIl+PzFOqWmZ4NH0n/mNWzEfXo/FsAkeC6pFGUey1op5CXVO5kThIveG9d94MbBqHQdN0ihkX0thjfuH52pJmXAuvrnH42jrCNBr/Tag1Ghbw5Mk1rSvnm2AGCubSjXC7zXhSmamwR27WuGPyebg7iMz3bniOMRFtlO/crHXT1k0j0sBYZE2VxDVugQ+9weC2HQ2sNYLWCFuj1xr9No1ijx6QmB2+PrjDx5DCIAbKAgh70LddWhothHHC3qLQOH5rgNo5+4c84HLMYvxAYL1ib7ELDU8sg6wMfC0LsF+wPbedqw45V7ASWyEtY+aD9/APcU6IyFEHAAA="
    var b64Data  =   testData.substring(9);
    // Decode base64 (convert ascii to binary)
    var strData     = atob(b64Data);
    // Convert binary string to character-number array
    var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
    // Turn number array into byte-array
    var binData     = new Uint8Array(charData);
    // Pako magic makeing
    var data        = myPako.inflate(binData);
    // Convert gunzipped byteArray back to ascii string:
    let strData2: string  = String.fromCharCode.apply(null, new Uint16Array(data));

    var mediPlan = JSON.parse(strData2)
    console.log(mediPlan)
  }
  testDummyData(){
    var testData = "CHMED16A1H4sIAAAAAAAEAK1UzW7aQBB+lY2vsaNd24DNLQmhRQktIrSRWuWwtge8wl6j9bpNQLxNHqO3vFhn7TglAXKqhPF4Z3bmm29+NtZ5pVOrb/W6lFHqudQPOz3LtgYaD13Kug6jDgtmLOgzr+95p9TtU4oGowQNIt+bh91o7vjzwHV8CCMn5FHghDGN58E86PDQOBtDMntcgdVntSxinoPUpdX/ubHOV6uRLLVCb5LHKUkgJ1dlCbKN4fshY14TsvHi2dakaG4P8J/Z1Mbn3oAeqiJvgdMQf3Uqs2LnjIXWFm0nqoyji0dUDNQZ+VJoMlRcrm3zqkDOIUvw7rTgaDH5iuJsuZiWEr9GqFxqURiE36QwRN3Orq2tvWkAuwGjXtf/GDA9BNhzKDsA7lytNfnMZWmT8fMfGacgU141FB0CeJFhTYs4TVQVL4+AZKHb890PWKXHWP1PIC/TIoNSgxISjZag9oHutkaliDjLz2xipKRS2CnC6CoBSgOZgCoLCfKk7RqXscD3jqfnHqxBx2EMMzyQ3tUDz1cZkGuuMpvcPT/JhXjNbDR+Qz+oKhWLSi7+pTS+eZ9RBIJcQMLVHK1wCAscjHpAavg4AWLxW8RLyHZyYPslOthHL40/klNAa2ayeUU3FBDtku3sARMlWVck5w9nxMdXRvTz0yITyDgjMx5loJFwEFJCmtfl3UPv97oe83pH2P8QKyKdNWZFY0a392+r8X5THWqu2xihqTW8H1HjiGuBy8fqb6yLesmx0PfqsjM0vhTaxLjjWWIy1k0Rh19wYZkgoGvqPoFMUDBob15U46psdDd4A1vmqll7JszgptRjMLDqM97Q8FrRBp9rW995hjYBqwvSqN1WzVo1C2idxjSuvYwa1qf40en17tvxdlvBawW/FTqt0G2vMSR4i8SkOEAY4dRnpBcS5nrE75CuofhWKwDdtPYCu4TjfibMbLgfYoXHoRviUkV/+dLkDoq8sExEqcmvIidm6y+5WZrlKuOSRLAAYRjTJ9b2LyrDpWuFBgAA"
    var b64Data  =   testData.substring(9);

    // Decode base64 (convert ascii to binary)
    var strData     = atob(b64Data);

    // Convert binary string to character-number array
    var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});

    // Turn number array into byte-array
    var binData     = new Uint8Array(charData);

    // Pako magic makeing
    var data        = myPako.inflate(binData);

    // Convert gunzipped byteArray back to ascii string:


    let strData2: string  = String.fromCharCode.apply(null, new Uint16Array(data));

    this.storage.ready().then(() => {
      var mediPlan = JSON.parse(strData2)
      this.storage.set("mediPlan", mediPlan);
      this.getNamesFromID(mediPlan).then((res) => {
          this.storage.set("medicationData", res);
      });
    })

    }

    getNamesFromID(medData){
             this.list = new Array<any>();
             var hciS = new HCIService();
             for (let medi of medData['Medicaments']){
               var l = hciS.getHCIData(this.http,medi.Id,"phar").then(function(response) {
                     if(Number(medi.Id)){
                     var result = JSON.parse(response._body);
                     var desc = result.article[0].dscrd;
                     var title = desc.split(" ")[0];
                     medi.description = desc
                     medi.title = title
                   }
                   else{
                     medi.description = medi.Id
                     medi.title = medi.Id
                   }
               });

               this.list.push(l);
             }

               return Promise.all(this.list).then((res) => {
                 return medData['Medicaments'];
               });
             }
}
