import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import firebase from 'firebase';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { CustomerSingleJobViewPage } from '../customer-single-job-view/customer-single-job-view';
import { CustomerJobListingPage } from '../customer-job-listing/customer-job-listing';
/**
 * Generated class for the CustomerLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-login',
  templateUrl: 'customer-login.html',
})
export class CustomerLoginPage {

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public appCtrl: App,public authData:CustomerAuthProvider) {
  }

  ionViewDidLoad() {
    this.recaptchaVerifier= new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      'callback': function (response) {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
      });
    // this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    console.log('ionViewDidLoad PhoneLoginPage');
    
   
  }

  signIn(phoneNumber: number){
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+" + phoneNumber;
    let self=this;
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( confirmationResult => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        let prompt = this.alertCtrl.create({
        title: 'Enter the Confirmation code',
        inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
        buttons: [
          { text: 'Cancel',
            handler: data => { console.log('Cancel clicked'); }
          },
          { text: 'Send',
            handler: data => {
              confirmationResult.confirm(data.confirmationCode)
                .then(function (result) {
                  // User signed in successfully.
                  // console.log(result.user);
                  self.authData.loginWithPhone(firebase.auth().currentUser.phoneNumber);
                  prompt.dismiss().then(() => {
                   self.navCtrl.setRoot(CustomerJobListingPage);
                  });
                  // ...
                }).catch(function (error) {
                  // User couldn't sign in (bad verification code?)
                  // ...
                  let alert = self.alertCtrl.create({
                    title: 'Error',
                    subTitle: 'Invalid OTP.User authentication failed!!',
                    buttons: ['Dismiss']
                  });
                  alert.present();
                });
            }
          }
        ]
      });
      prompt.present();
      
    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });

    
  } 

}
