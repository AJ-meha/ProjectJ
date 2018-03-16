import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomerJobListingPage } from '../customer-job-listing/customer-job-listing';
import { FavouritePage } from '../favourite/favourite';
import { MessagePage } from '../message/message';
import { SearchPage } from '../search/search';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the CustomerDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'dashboard',
  segment:'dashboard'
})
@Component({
  selector: 'page-customer-dashboard',
  templateUrl: 'customer-dashboard.html',
})
export class CustomerDashboardPage {
  tab1Root = CustomerJobListingPage;
  tab2Root = FavouritePage;
  tab3Root = MessagePage;
  tab4Root = ProfilePage;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerDashboardPage');
  }

}
