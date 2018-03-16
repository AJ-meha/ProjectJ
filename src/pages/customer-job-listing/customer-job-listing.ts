import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { CustomerLoginPage } from '../customer-login/customer-login';

/**
 * Generated class for the CustomerJobListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-job-listing',
  templateUrl: 'customer-job-listing.html',
})
export class CustomerJobListingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public authData:CustomerAuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerJobListingPage');
  }

  logOut(){
    this.authData.logoutUser().then(authData=>{
      this.navCtrl.setRoot(CustomerLoginPage);
      //this.navCtrl.popAll();
      //this.navCtrl.push("LoginPage");
    });
  }

}
