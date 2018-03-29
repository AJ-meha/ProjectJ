import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomerJobListingPage } from '../customer-job-listing/customer-job-listing';
import { FavouritePage } from '../favourite/favourite';
import { MessagePage } from '../message/message';
import { SearchPage } from '../search/search';
import { ProfilePage } from '../profile/profile';

import { AngularFireAuth } from 'angularfire2/auth';

import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
/**
 * Generated class for the CustomerDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: 'dashboard',
    segment:'dashboard'
  }
)
@Component({
  selector: 'page-customer-dashboard',
  templateUrl: 'customer-dashboard.html',
})
export class CustomerDashboardPage {
  tab1Root = CustomerJobListingPage;
  tab2Root = FavouritePage;
  tab3Root = MessagePage;
  tab4Root = ProfilePage;
  constructor(public navCtrl: NavController, public navParams: NavParams, afAuth: AngularFireAuth,public customerAuthData:CustomerAuthProvider) {

    let self=this;
    // const authObserver=afAuth.authState.subscribe(user=>{
    //   if(user){
    //     this.customerAuthData.getUserPhone().then(userphone=>{
    //       if(userphone==null)
    //       {
    //         self.navCtrl.setRoot("login");
    //         authObserver.unsubscribe();
    //       }
    //     });
    //   }
    //   else{
    //     self.navCtrl.setRoot("login");
    //     authObserver.unsubscribe();
    //   }
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerDashboardPage');
  }

}
