import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { CustomerAuthProvider } from '../providers/customer-auth/customer-auth';

import { Title, Meta }     from '@angular/platform-browser';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any='home';
  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth,public customerAuthData:CustomerAuthProvider, private translateService: TranslateService, public events: Events, private titleService: Title, private metaService: Meta) {

    let self=this;

    let selected_language='en';

    this.customerAuthData.getLanguage().then(customer_lang=>{
        if(customer_lang==null)
        {
          selected_language='en';
        }
        else
        {
          selected_language=customer_lang;
        }
      });
    
    const authObserver=afAuth.authState.subscribe(user=>{
      if(user){
        this.customerAuthData.getUserPhone().then(userphone=>{
          if(userphone==null)
          {
            self.nav.setRoot("home",{"lang":selected_language});
            authObserver.unsubscribe();
          }
          else
          {
            self.nav.setRoot("dashboard");
            authObserver.unsubscribe();
          }
        });
      }
      else{
        this.nav.setRoot("home",{"lang":selected_language});
        authObserver.unsubscribe();
      }
    });

    this.events.subscribe("app:localize",(lang) => {
       this.translateService.use(lang);
     });

    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      translateService.get('GLOBAL.PAGE_TITLE').subscribe((res: string) => {
        titleService.setTitle(res);
      });
      translateService.get('GLOBAL.META_DESCRIPTION').subscribe((res: string) => {
        metaService.updateTag({ name: 'description', content: res });
        metaService.updateTag({ property:"og:title", content: res });
        //metaService.addTag({ name: 'description', content: res });
      });
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      translateService.setDefaultLang('en');
      translateService.use(selected_language);
    });
  }


}

