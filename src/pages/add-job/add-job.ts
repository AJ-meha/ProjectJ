import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the AddJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-job',
  templateUrl: 'add-job.html',
})
export class AddJobPage {
	@ViewChild(NavController) nav: NavController;
	pages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.pages = [
  	  { title: 'Home', component: TabsPage },
  	  { title: 'Add Job', component: AddJobPage }
  	];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddJobPage');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.setRoot(page.component);
  }

}
