import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

import { AdminLoginPage } from '../admin-login/admin-login';

/**
 * Generated class for the AdminDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'dashboard',
  segment:'admin/dashboard'
})
@Component({
  selector: 'page-admin-dashboard',
  templateUrl: 'admin-dashboard.html',
})
export class AdminDashboardPage {

  useremail:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthProvider) {
    this.getUserEmail();
  }

  getUserEmail(){
    this.authData.getUserEmail().then(useremail=>{
      this.useremail=useremail;
      console.log("useremail=="+useremail);
    })
  }

  logOut(){
    this.authData.logoutUser().then(authData=>{
      this.navCtrl.setRoot(AdminLoginPage);
      //this.navCtrl.popAll();
      //this.navCtrl.push("AdminLoginPage");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminDashboardPage');
  }

}
