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

@IonicPage(
  {
    name: "customer-verification",
    segment: "verify/:lang"
  }
)
@Component({
  selector: 'page-customer-verification',
  templateUrl: 'customer-verification.html',
})
export class CustomerVerificationPage {

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  confirmationResult:any;
  confirmationCode:any;

  otpCode = {otp1:"",otp2:"",otp3:"",otp4:"",otp5:"",otp6:""}
  mobile_no:any;
  valid_otp=true;
  valid_number=true;
  codeContent=false;
  initContent=true;
  timer="00:30";
  resend=false;
  countDown=true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public authData:CustomerAuthProvider) {
    this.mobile_no = this.navParams.get('mobile');
  }

  sendOTP() {
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = this.navParams.get('mobile');
    let self=this;
    firebase.auth().languageCode = this.navParams.get('lang');
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then( confirmationResult => {
        this.codeContent=true;
        this.initContent=false;
        this.timer="00:30";
        this.resend=false;
        this.countDown=true;
        var countDown = 30;
        var x = setInterval(function() {
          countDown--;
          if (countDown < 10) {
            self.timer = "00:0" + countDown;
          }
          else
          {
            self.timer = "00:" + countDown;
          }

          if (countDown <= 0) {
            clearInterval(x);
            self.resend=true;
            self.countDown=false;
          }
        }, 1000);
        //this.timer="";
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.confirmationResult=confirmationResult;
        //self.authData.loginWithPhone(firebase.auth().currentUser.phoneNumber);

    })
    .catch(function (error) {
      self.valid_number=false;
      console.error("SMS not sent", error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerVerificationPage');

    if(this.mobile_no==undefined)
    {
      return false;
    }

    this.recaptchaVerifier= new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      'callback': function (response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    this.sendOTP();

    this.viewCtrl.showBackButton(false);
  }

  goBack() {
    this.navCtrl.pop();
  }

  // Focus on next input field for OTP
  next(event: KeyboardEvent,el1,el2) {
    if(event.key=="Backspace")
    {
      el1.setFocus();
    }
    else
    {
      el2.setFocus();
    }
  }

  check_OTP()
  {
    if(this.otpCode.otp1=='' || this.otpCode.otp2=='' || this.otpCode.otp3=='' || this.otpCode.otp4=='' || this.otpCode.otp5=='' || this.otpCode.otp6=='')
    {
      return true;
    }
  }

  // Temporary click action. TO BE REMOVED
  tempListing(){
    let self=this;
    if(this.confirmationResult==undefined)
    {
      return false;
    }
    this.confirmationCode=this.otpCode.otp1+this.otpCode.otp2+this.otpCode.otp3+this.otpCode.otp4+this.otpCode.otp5+this.otpCode.otp6
    this.confirmationResult.confirm(this.confirmationCode)
    .then(function (result) {
      // User signed in successfully.
      // console.log(result.user);
      self.authData.loginWithPhone(firebase.auth().currentUser.phoneNumber);
      self.navCtrl.setRoot('dashboard');
      // ...
    }).catch(function (error) {
      // User couldn't sign in (bad verification code?)
      // ...
      self.valid_otp=false;
      console.log("ERROR :"+error);
    });
  }

}
