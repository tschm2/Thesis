import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import myPako from "../../../node_modules/pako"

/*
  Generated class for the Nutrition page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html'
})
export class NutritionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NutritionPage');

    BarcodeScanner.scan().then((barcodeData) => {

    console.log(barcodeData);
      var b64Data  =   barcodeData.text.substring(9);
    console.log(b64Data);
      // Decode base64 (convert ascii to binary)
      var strData     = atob(b64Data);
    console.log(strData);
      // Convert binary string to character-number array
      var charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
    console.log(charData);
      // Turn number array into byte-array
      var binData     = new Uint8Array(charData);
    console.log(binData);
      // Pako magic
      var data        = myPako.inflate(binData);
    console.log(data);
      // Convert gunzipped byteArray back to ascii string:
      let strData2: string  = String.fromCharCode.apply(null, new Uint16Array(data));

      console.log(strData2);

 // Success! Barcode data is here
}, (err) => {
    // An error occurred
});

      // Get some base64 encoded binary data from the server. Imagine we got this:

      // Output to console
      //
      // Here you can do base64 encode, make xhr requests and so on.
      //

  }

}
