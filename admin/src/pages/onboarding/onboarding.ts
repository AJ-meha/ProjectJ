import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the OnboardingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: "onboarding",
    segment: "onboarding"
  }
)
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData:AuthProvider) {

    let self=this;
    this.authData.getUserEmail().then(useremail=>{
      if(useremail==null)
      {
        self.authData.setAdminInit(window.location.href);
        self.navCtrl.setRoot("admin-login");
      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
  }

}
