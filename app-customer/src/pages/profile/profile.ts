import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { Http,Headers } from '@angular/http';
import firebase  from 'firebase';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  language_selection:any;

  constructor(public http:Http,public navCtrl: NavController, private translateService: TranslateService,public customerAuthData:CustomerAuthProvider, public modalCtrl: ModalController) {
    let self=this;
    this.customerAuthData.getLanguage().then(customer_lang=>{
      self.language_selection=customer_lang;
    });
  }

  segmentChanged(event) {
    this.customerAuthData.setLanguage(event)
    this.translateService.use(event);
    this.customerAuthData.setLanguagePref(event);
  }

  logOut(){
    this.customerAuthData.logoutUser().then(authData=>{
      this.navCtrl.setRoot('home',{"lang":this.language_selection});
      //this.navCtrl.popAll();
      //this.navCtrl.push('home',{"lang":this.language_selection});
    });
  }

  getAPI(){
    const url = 'https://us-central1-project-j-main.cloudfunctions.net/api/jobs';

    firebase.auth().currentUser.getIdToken()
            .then(authToken => {
              const headers = new Headers({'Authorization': 'Bearer ' + authToken });
              headers.append('Access-Control-Allow-Origin' , '*');
              headers.append('Accept' , 'application/json');
              headers.append('Content-Type' , 'application/json');

              const myUID    = { uid: 'current-user-uid' };    // success 200 response
              const notMyUID = { uid: 'some-other-user-uid' }; // error 403 response

              return this.http.get(url, { headers: headers }).toPromise()
            })
            .then(res => console.log(res))

  }

  selectLang() {
    let modal = this.modalCtrl.create("CustomerLanguagePage");
    modal.present();
  }

}
