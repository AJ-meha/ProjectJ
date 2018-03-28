import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { CustomerAuthProvider } from '../providers/customer-auth/customer-auth';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  @ViewChild(Nav) nav: Nav;
  public is_admin:boolean=false
  pages: Array<{title:string,name:any}>;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth,public customerAuthData:CustomerAuthProvider, private translateService: TranslateService) {
    this.pages=[
      {title:'Dashboard',name:"admin-dashboard"},
      {title:'Add Job',name:"admin-create-jobs"},
      {title:'List Jobs',name:"admin-list-jobs"},
      {title:'Home (WIP)',name:"home"},
      {title:'Onboarding (WIP)',name:"onboarding"}
    ];
    let loc=window.location.href;
    if(loc.indexOf('#/admin') != -1){
      this.is_admin=true
    }
    let self=this;
    if(this.is_admin==false){
      const authObserver=afAuth.authState.subscribe(user=>{
        if(user){
          this.customerAuthData.getUserPhone().then(userphone=>{
            if(userphone==null)
            {
              self.nav.setRoot("home");
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
          this.nav.setRoot("home");
          authObserver.unsubscribe();
        }
      });
    }
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      translateService.setDefaultLang('en');
      this.customerAuthData.getLanguage().then(customer_lang=>{
        if(customer_lang==null)
        {
          translateService.use('en');
        }
        else
        {
          translateService.use(customer_lang);
        }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.name=="admin-create-jobs")
    {
      window.location.href="/#/admin/jobs/add/new"
    }
    else
    {
      this.nav.setRoot(page.name);
    }
  }
}

