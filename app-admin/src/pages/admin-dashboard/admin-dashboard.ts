import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the AdminDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: 'admin-dashboard',
    segment:'dashboard'
  }
)
@Component({
  selector: 'page-admin-dashboard',
  templateUrl: 'admin-dashboard.html',
})
export class AdminDashboardPage {

  userename:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthProvider) {

    let self=this;
    this.authData.getUserEmail().then(useremail=>{
      if(useremail==null)
      {
        self.authData.setAdminInit(window.location.href);
        self.navCtrl.setRoot("admin-login");
      }
    });
    
    this.getUserName();
  }

  getUserName(){
    this.authData.getUserName().then(userename=>{
      this.userename=userename;
    })
  }

  logOut(){
    this.authData.logoutUser().then(authData=>{
      this.navCtrl.setRoot("admin-login");
      //this.navCtrl.popAll();
      //this.navCtrl.push(""admin-login"");
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminDashboardPage');
  }

}
