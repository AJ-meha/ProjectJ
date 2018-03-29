import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth } from 'angularfire2/auth';

import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title:string,name:any}>;
  constructor(public app:App,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth,public authData:AuthProvider) {
    this.pages=[
      {title:'Dashboard',name:"admin-dashboard"},
      {title:'Add Job',name:"admin-create-jobs"},
      {title:'List Jobs',name:"admin-list-jobs"}
    ];

    let self=this;
    let loc=window.location.href;
    this.authData.getUserEmail().then(useremail=>{
      if(useremail!=null)
      {
        if((loc.indexOf('#/') == -1) || (loc[loc.indexOf('#/')+2]==undefined)){
          self.nav.setRoot("admin-dashboard");
        }
        else{
          //console.log(loc.indexOf('#/admin/'));
          //console.log(loc[loc.indexOf('#/admin/')+8]);
        }
      }
      else
      {
        if((loc.indexOf('#/') == -1) || (loc[loc.indexOf('#/')+2]==undefined)){
          self.authData.setAdminInit("init");
        }
        else{
          self.authData.setAdminInit(window.location.href);
        }
        self.nav.setRoot("admin-login");
      }
    });

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
    if(page.name=="admin-create-jobs")
    {
      this.nav.setRoot(page.name,{'action':'add','id':'new'});
    }
    else
    {
      this.nav.setRoot(page.name);
    }
  }
}
