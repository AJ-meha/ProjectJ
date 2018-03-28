import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CustomerVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-verification',
  templateUrl: 'customer-verification.html',
})
export class CustomerVerificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerVerificationPage');
    this.viewCtrl.showBackButton(false);
  }

  goBack() {
    this.navCtrl.pop();
  }

  // Focus on next input field for OTP
  next(el) {
    el.setFocus();
  }

  // Temporary click action. TO BE REMOVED
  tempListing(){
    this.navCtrl.setRoot('page-search');
  }

}
