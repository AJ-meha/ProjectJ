import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the JobBenefitsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'jobBenefits',
	segment:'job-benefits'
})
@Component({
  selector: 'page-job-benefits',
  templateUrl: 'job-benefits.html',
})
export class JobBenefitsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobBenefitsPage');
    this.viewCtrl.showBackButton(false);
  }

  goBack() {
      this.navCtrl.pop();
  }

}