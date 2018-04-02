import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CustomerLanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-language',
  templateUrl: 'customer-language.html',
})
export class CustomerLanguagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerLanguagePage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
