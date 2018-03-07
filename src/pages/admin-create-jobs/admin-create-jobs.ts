import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AdminCreateJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: 'create',
    segment:'admin/jobs/create'
  }
)
@Component({
  selector: 'page-admin-create-jobs',
  templateUrl: 'admin-create-jobs.html',
})
export class AdminCreateJobsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminCreateJobsPage');
  }

}
