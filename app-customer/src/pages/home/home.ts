import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, Events } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';

import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';

@IonicPage(
  {
    name: "home",
    segment: "home/:lang"
  }
)
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  langArray = GlobalVarsProvider.langArray;
  language_selection:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private translateService: TranslateService,public customerAuthData:CustomerAuthProvider, public events: Events) {
    let url_language=this.navParams.get('lang');
    console.log(url_language);
    if(this.langArray.indexOf(url_language)!=-1)
    {
      this.customerAuthData.setLanguage(url_language)
      this.language_selection=url_language;
      this.events.publish("app:localize",url_language);
    }
    else
    {
      this.customerAuthData.getLanguage().then(customer_lang=>{
        if(customer_lang==null)
        {
          this.customerAuthData.setLanguage('en')
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
  }

  segmentChanged(event) {
    this.customerAuthData.setLanguage(event)
    //this.events.publish("app:localize",event);
    this.navCtrl.setRoot('home',{'lang':this.language_selection});
  }


  openPage(){
    this.navCtrl.push('login',{'lang':this.language_selection});
  }
}
