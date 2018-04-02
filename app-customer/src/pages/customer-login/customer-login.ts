import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, ViewController, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import firebase from 'firebase';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';

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
    segment: "login/:lang"
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

  langArray = GlobalVarsProvider.langArray;
  language_selection:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public appCtrl: App,public authData:CustomerAuthProvider,public formBuilder:FormBuilder, private translateService: TranslateService, public viewCtrl: ViewController, public events: Events) {
    let url_language=this.navParams.get('lang');
    if(this.langArray.indexOf(url_language)!=-1)
    {
      this.authData.setLanguage(url_language)
      this.language_selection=url_language;
      this.events.publish("app:localize",url_language);
    }
    else
    {
      this.authData.getLanguage().then(customer_lang=>{
        if(customer_lang==null)
        {
          this.authData.setLanguage('en')
          this.language_selection='en';
          this.events.publish("app:localize",'en');
        }
        else
        {
          this.language_selection=customer_lang;
          this.events.publish("app:localize",customer_lang);
        }
      });
    }

    this.loginForm=formBuilder.group({
      mobile:['',Validators.compose([Validators.required,Validators.pattern('\\d{8,11}$')])]
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
      this.navCtrl.push("customer-verification",{'mobile':phoneNumberString,'lang':this.language_selection});
    }
  }

  ngOnInit(){
  }

  goBack() {
    this.navCtrl.pop();
  }

}
