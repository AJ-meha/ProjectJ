import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { Http,Headers } from '@angular/http';
import firebase  from 'firebase';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public http:Http,public navCtrl: NavController, private translateService: TranslateService,public customerAuthData:CustomerAuthProvider) {

  }

  logOut(){
    this.customerAuthData.logoutUser().then(authData=>{
      this.navCtrl.setRoot("home");
      //this.navCtrl.popAll();
      //this.navCtrl.push("home");
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

}
