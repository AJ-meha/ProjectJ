import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { JobDetailsPage } from '../job-details/job-details';
import { JobBenefitsPage } from '../job-benefits/job-benefits';
/**
 * Generated class for the CustomerSingleJobViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-single-job-view',
  templateUrl: 'customer-single-job-view.html',
})
export class CustomerSingleJobViewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleJobPage');
    this.viewCtrl.showBackButton(false);
  }

  openDetails() {
      this.navCtrl.push(JobDetailsPage);
  }

  openBenefits() {
      this.navCtrl.push(JobBenefitsPage);
  }

  goBack() {
      this.navCtrl.pop();
  }

}
