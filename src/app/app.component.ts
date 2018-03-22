import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth } from 'angularfire2/auth';

import { AuthProvider } from '../providers/auth/auth';
import { CustomerAuthProvider } from '../providers/customer-auth/customer-auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title:string,name:any}>;
  public is_admin:boolean=false
  constructor(public app:App,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth,public authData:AuthProvider,public customerAuthData:CustomerAuthProvider) {
    this.pages=[
      {title:'Dashboard',name:"admin-dashboard"},
      {title:'Add Job',name:"admin-create-jobs"},
      {title:'List Jobs',name:"admin-list-jobs"},
      {title:'Onboarding (WIP)',name:"onboarding"}
    ];
    console.log("loc="+window.location.href)
    let loc=window.location.href;
    if(loc.indexOf('#/admin') != -1){
      this.is_admin=true
    }

    let self=this;
    if(this.is_admin == true){
      this.authData.getUserEmail().then(useremail=>{
        if(useremail!=null)
        {
          if((loc.indexOf('#/admin/') == -1) || (loc[loc.indexOf('#/admin/')+8]==undefined)){
            self.nav.setRoot("admin-list-jobs");
          }
          else{
            console.log(loc.indexOf('#/admin/'));
            console.log(loc[loc.indexOf('#/admin/')+8]);
          }
        }
        else
        {
          self.authData.setAdminInit("init");
          self.nav.setRoot("admin-login");
        }
      });
    }
    else{
      const authObserver=afAuth.authState.subscribe(user=>{
        if(user){
          this.customerAuthData.getUserPhone().then(userphone=>{
            if(userphone==null)
            {
              self.nav.setRoot("login");
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
          this.nav.setRoot("login");
          authObserver.unsubscribe();
        }
      });
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.name);
  }
}
