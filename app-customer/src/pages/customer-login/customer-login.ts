import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import firebase from 'firebase';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
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

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public appCtrl: App,public authData:CustomerAuthProvider,public formBuilder:FormBuilder) {

    this.loginForm=formBuilder.group({
      mobile:['',Validators.compose([Validators.required,Validators.pattern('\\d{10}$')])]
    });

    console.log(this.mobile_arr)
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
                     self.navCtrl.setRoot("dashboard");
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
