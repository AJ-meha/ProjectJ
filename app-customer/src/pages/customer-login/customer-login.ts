import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import firebase from 'firebase';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';

import { TranslateService } from '@ngx-translate/core';

import { CustomerVerificationPage } from '../customer-verification/customer-verification';

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
  mobile_codeArr = GlobalVarsProvider.mobile_code;
  mobile_code = "+852";
  submitted=false;
  phoneNumber='';

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public appCtrl: App,public authData:CustomerAuthProvider,public formBuilder:FormBuilder, private translateService: TranslateService, public viewCtrl: ViewController) {

    this.loginForm=formBuilder.group({
      mobile:['',Validators.compose([Validators.required,Validators.pattern('\\d{10}$')])]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhoneLoginPage');
    this.viewCtrl.showBackButton(false);

  }

  signIn(phoneNumber: number){
    if(!this.loginForm.valid){
      console.log(this.loginForm.value);
    }
    else{
      this.submitted=false;
      const phoneNumberString = this.mobile_code + phoneNumber;
      this.navCtrl.push(CustomerVerificationPage,{'mobile':phoneNumberString});
    }
  }

  ngOnInit(){
  }

  goBack() {
    this.navCtrl.pop();
  }

}
