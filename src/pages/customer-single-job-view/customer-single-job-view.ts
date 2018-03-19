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

@IonicPage(
  {
    name: "job",
    segment: "job/:id"
  }
)
@Component({
  selector: 'page-customer-single-job-view',
  templateUrl: 'customer-single-job-view.html',
})
export class CustomerSingleJobViewPage {
  public id:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    console.log("id="+ this.navParams.get('id'))
    this.id=this.navParams.get('id')
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
