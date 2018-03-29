import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import firebase from 'firebase';

import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';

/**
 * Generated class for the CustomerVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-verification',
  templateUrl: 'customer-verification.html',
})
export class CustomerVerificationPage {

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  confirmationResult:any;
  confirmationCode:any;

  otpCode = {otp1:"",otp2:"",otp3:"",otp4:"",otp5:"",otp6:""}

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public authData:CustomerAuthProvider) {
    console.log(this.navParams.get('mobile'))
    this.recaptchaVerifier= new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      'callback': function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });

    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = this.navParams.get('mobile');
    let self=this;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult=confirmationResult;
        //self.authData.loginWithPhone(firebase.auth().currentUser.phoneNumber);

    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerVerificationPage');
    this.viewCtrl.showBackButton(false);
  }

  goBack() {
    this.navCtrl.pop();
  }

  // Focus on next input field for OTP
  next(el) {
    el.setFocus();
  }

  // Temporary click action. TO BE REMOVED
  tempListing(){
    let self=this;
    this.confirmationCode=this.otpCode.otp1+this.otpCode.otp2+this.otpCode.otp3+this.otpCode.otp4+this.otpCode.otp5+this.otpCode.otp6
    this.confirmationResult.confirm(this.confirmationCode)
    .then(function (result) {
      // User signed in successfully.
      // console.log(result.user);
      self.authData.loginWithPhone(firebase.auth().currentUser.phoneNumber);
      self.navCtrl.setRoot('page-search');
      // ...
    }).catch(function (error) {
      // User couldn't sign in (bad verification code?)
      // ...
      console.log("ERROR :"+error);
    });
  }

}
