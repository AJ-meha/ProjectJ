import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController, private translateService: TranslateService,public customerAuthData:CustomerAuthProvider) {

  }

  segmentChanged(event) {
  	this.customerAuthData.setLanguage(event._value)
    this.translateService.use(event._value);
  }

}
