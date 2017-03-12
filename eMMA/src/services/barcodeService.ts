import { BarcodeScanner } from 'ionic-native';
import myPako from "../../node_modules/pako"
import { Storage } from '@ionic/storage';

export class barcodeService {
test:string;
storage:Storage
      constructor(storage: Storage) {
        this.storage = storage;
      this.storage.get('test').then((val) => {
              this.test = val;
              console.log(this.test);
            })
    }

    scanQRcodeForJSON(): string{

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

          console.log(strData2);
          return strData2;
     // Success! Barcode data is here
    }, (err) => {
      alert("Woops falscher QR-Code");
        // An error occurred
    });
      return ;
          // Get some base64 encoded binary data from the server. Imagine we got this:

          // Output to console
          //
          // Here you can do base64 encode, make xhr requests and so on.
          //

}
    testDummyData(): JSON{
      var testData = "CHMED16A1H4sIAAAAAAAEAK1UzW7aQBB+lY2vsaNd24DNLQmhRQktIrSRWuWwtge8wl6j9bpNQLxNHqO3vFhn7TglAXKqhPF4Z3bmm29+NtZ5pVOrb/W6lFHqudQPOz3LtgYaD13Kug6jDgtmLOgzr+95p9TtU4oGowQNIt+bh91o7vjzwHV8CCMn5FHghDGN58E86PDQOBtDMntcgdVntSxinoPUpdX/ubHOV6uRLLVCb5LHKUkgJ1dlCbKN4fshY14TsvHi2dakaG4P8J/Z1Mbn3oAeqiJvgdMQf3Uqs2LnjIXWFm0nqoyji0dUDNQZ+VJoMlRcrm3zqkDOIUvw7rTgaDH5iuJsuZiWEr9GqFxqURiE36QwRN3Orq2tvWkAuwGjXtf/GDA9BNhzKDsA7lytNfnMZWmT8fMfGacgU141FB0CeJFhTYs4TVQVL4+AZKHb890PWKXHWP1PIC/TIoNSgxISjZag9oHutkaliDjLz2xipKRS2CnC6CoBSgOZgCoLCfKk7RqXscD3jqfnHqxBx2EMMzyQ3tUDz1cZkGuuMpvcPT/JhXjNbDR+Qz+oKhWLSi7+pTS+eZ9RBIJcQMLVHK1wCAscjHpAavg4AWLxW8RLyHZyYPslOthHL40/klNAa2ayeUU3FBDtku3sARMlWVck5w9nxMdXRvTz0yITyDgjMx5loJFwEFJCmtfl3UPv97oe83pH2P8QKyKdNWZFY0a392+r8X5THWqu2xihqTW8H1HjiGuBy8fqb6yLesmx0PfqsjM0vhTaxLjjWWIy1k0Rh19wYZkgoGvqPoFMUDBob15U46psdDd4A1vmqll7JszgptRjMLDqM97Q8FrRBp9rW995hjYBqwvSqN1WzVo1C2idxjSuvYwa1qf40en17tvxdlvBawW/FTqt0G2vMSR4i8SkOEAY4dRnpBcS5nrE75CuofhWKwDdtPYCu4TjfibMbLgfYoXHoRviUkV/+dLkDoq8sExEqcmvIidm6y+5WZrlKuOSRLAAYRjTJ9b2LyrDpWuFBgAA"
      var b64Data  =   testData.substring(9);

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
        this.storage.set('test2', 'wubwub');
      })


      return JSON.parse(strData2);

      }
}
