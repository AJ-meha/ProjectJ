import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SingleJob_2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: 'single-job-details',
    segment:'jobview-details'
  }
)
@Component({
  selector: 'page-single-job-2',
  templateUrl: 'single-job-2.html',
})
export class SingleJob_2Page {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleJob_2Page');
    this.viewCtrl.showBackButton(false);
  }

  goBack() {
      this.navCtrl.pop();
  }

}
