import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { JobBenefitsPage } from '../job-benefits/job-benefits';
import { JobDetailsPage } from '../job-details/job-details';

/**
 * Generated class for the SingleJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'singleJob',
	segment:'single-job'
})
@Component({
  selector: 'page-single-job',
  templateUrl: 'single-job.html',
})
export class SingleJobPage {

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
