import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { AddJobPage } from '../add-job/add-job';

/**
 * Generated class for the ListJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
    name: 'list',
    segment:'list-jobs'
  }
 )
@Component({
  selector: 'page-list-jobs',
  templateUrl: 'list-jobs.html',
})
export class ListJobsPage {
	@ViewChild(NavController) nav: NavController;
  pages: Array<{title: string, component: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.pages = [
  	  { title: 'Home', component: TabsPage },
      { title: 'List Jobs', component: ListJobsPage },
  	  { title: 'Add a Job', component: AddJobPage }
  	];
  }

  private filterOptions: any = {
    role: {
    },
    status: {
    }
  }

  private toggleDrop(filtertype: string): void{
    this.filterOptions[filtertype].open = !this.filterOptions[filtertype].open;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListJobsPage');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.setRoot(page.component);
  }

}
