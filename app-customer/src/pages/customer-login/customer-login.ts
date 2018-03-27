import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import firebase from 'firebase';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';

import * as json_en from '../../assets/i18n/en.json';
import * as json_zh from '../../assets/i18n/zh.json';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the CustomerLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: "login",
    segment: "login"
  }
)
@Component({
  selector: 'page-customer-login',
  templateUrl: 'customer-login.html',
})
export class CustomerLoginPage {
  loginForm:FormGroup;
  mobile_code = GlobalVarsProvider.mobile_code;
  mobile_arr:any;
  langArr: JSON;

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public appCtrl: App,public authData:CustomerAuthProvider,public formBuilder:FormBuilder, private translateService: TranslateService) {

    this.loginForm=formBuilder.group({
      mobile:['',Validators.compose([Validators.required,Validators.pattern('\\d{10}$')])]
    });

    console.log(this.mobile_arr)

    switch(translateService.currentLang) { 
       case 'en': { 
          this.langArr = json_en;
          break; 
       } 
       case 'zh': { 
          this.langArr = json_zh; 
          break; 
       } 
       default: { 
          this.langArr = json_en;
          break; 
       } 
    }

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
    if(!this.loginForm.valid){
      this.validateAllFormFields(this.loginForm);
      console.log(this.loginForm.value);
    }
    else{
      const appVerifier = this.recaptchaVerifier;
      const phoneNumberString = GlobalVarsProvider.mobile_code + phoneNumber;
      let self=this;
      firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
        .then( confirmationResult => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          let prompt = this.alertCtrl.create({
          title: self.langArr.ENTER_CONFIRM_CODE,
          inputs: [{ name: 'confirmationCode', placeholder: self.langArr.CONFIRM_CODE }],
          buttons: [
            { text: self.langArr.CANCEL,
              handler: data => { console.log('Cancel clicked'); }
            },
            { text: self.langArr.SEND,
              handler: data => {
                confirmationResult.confirm(data.confirmationCode)
                  .then(function (result) {
                    // User signed in successfully.
                    // console.log(result.user);
                    self.authData.loginWithPhone(firebase.auth().currentUser.phoneNumber);
                    prompt.dismiss().then(() => {
                     self.navCtrl.setRoot("dashboard");
                    });
                    // ...
                  }).catch(function (error) {
                    // User couldn't sign in (bad verification code?)
                    // ...
                    let alert = self.alertCtrl.create({
                      title: self.langArr.ERROR,
                      subTitle: self.langArr.INVALID_OTP,
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

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  ngOnInit(){
    this.mobile_arr=GlobalVarsProvider.mobile_code_arr
  }

}
