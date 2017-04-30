import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HciHospAPI } from 'hci-hospindex-api';
import  * as  HCITypes from 'hci-hospindex-api/src/api';
/*
  Generated class for the Nutrition page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nutrition',
  templateUrl: 'nutrition.html',

})
export class NutritionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage) {

         }

  ionViewDidLoad() {

    let grouping:HCITypes.grouping = "byCheck"
    let extent:HCITypes.extent  = 'full';

        let checks=[];
    let stringChecks = [];
    stringChecks.push("doping", "nutrition")

    let checkType:HCITypes.checkType = "doping" // Default / if empty or missing: error
   for (var item of stringChecks) {

      let tempCheck:HCITypes.checkType = item
      let tCheck = {
        check:tempCheck
      } as HCITypes.check
      checks.push(tCheck)
}
  console.log(checks)


    let medication = "CHMED16A1H4sIAAAAAAAAA61V0XKbOhD9FZXXgkcCbMBPTeqk9TTuTR3f25neyYOABTTGwiPEtE3Gf9PPuG/5sbsSxY1dx08de9CiXWnPWa0Oj85Fpytn6rS6y0Hq9k1aVKOsclxnpnHapyzyaOj50Yqxqe9Pqf+a4pNiwDzHgDQMimSSFl5YxL4XQpJ6CU9jL8loVsRFPOZJhLELyFfft+BMmbVFxjcmmzP999G52G7nstUKdxOSIAqy6GROJFQYQ6wpskqTh460WSWhrs1Yd5CtQQ44wsSP4nFkX/tMgevcNn2GGT6Za3/3hti1ajYH5CzdVbOfizyfOjuMvVVtll5+R8enjreCXKgHTVZiQ2aNkqBw3bLh6L37hOZqXS5biW9fvoIqQVa80KJcg9Do/FsKU9C71Qdn5x6QljyrkPaGXLXtM0JhwlhAzxGiSIgeEZp4NMH/ASE7x5IjQjM1Ih8bTa4Vlw+uGTqQBdT5ntTtX89JzdG51qKRv5OxgP2Y0WASngdMTwEOPMpOgLO1fs9l65LF038yq0xFu75EpwBe1tjKTVblqsvWL4Bk2Cahf6aq9KWq/iGQb6umhlaDEhKD1raFzrRGp4gYbUYuMVbeKewUYXydAKWB3IJqGwny1dA1PmNxGLxMzz95BmOPMWR4gt7VN77Z1kA+cFW75PPTD1mKPbP54qD8oLpKlJ0sf1Fa3BwzSkGQS8i5KjAKtadBNbCqYOHjDRDlV4EXu37Ggf1+RCf76Gfjz+USMJoZNnt01wLS58X20MyhzZTY2p4+zq2FruFo9piKaI0mbfi3EQlxqIl++lHWqFWEkRVPa9B4RCBkr2Sn+IbRJGDBS6p1lh1yW/VhTR9Gd/eH5xdNKKM08GmYWGE81Y53GUJTD3B8qc1GXAvUaGf66FzabwFLwsA2CsPgt0KbHJ95nRvGuj/264+o6yYJaFvsdyBzNAzam5+uRdf2vhtcgU121X8dTJrZTasXYGDZOd6XYd8DPT7fdf7hNcbEzB5I7/YHNxvcLO4VfJnZXeZ91Zf4Mo6i+0EQ/MEIBiMcjPFgTIZlDAu8w8JUeOUww+uQkSghzA9IOCYTU+I7rQB0fxlK7BKOik6Y0cQvYovTiZ+gDON+m7Xh3myFLDXKgbP7H9Txj/uJBwAA"

    let hciCdsCheckRequest = {
       medication: medication,
       extent: extent,
       grouping: grouping,
       checks: checks
    } as HCITypes.hciCdsCheckRequest;
    console.log(HciHospAPI.hciCdsCheck(hciCdsCheckRequest))
  }


}
