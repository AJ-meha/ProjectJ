import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AdminLoginPage } from '../pages/admin-login/admin-login';
import { AdminDashboardPage } from '../pages/admin-dashboard/admin-dashboard';

import { AngularFireAuth } from 'angularfire2/auth';

import { AuthProvider } from '../providers/auth/auth';
import { AdminCreateJobsPage } from '../pages/admin-create-jobs/admin-create-jobs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title:string,component:any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth,public authData:AuthProvider) {
    this.pages=[
      {title:'Dashboard',component:AdminDashboardPage},
      {title:'Add Job',component:AdminCreateJobsPage}
    ];

    const authObserver=afAuth.authState.subscribe(user=>{
      if(user){
        this.authData.getUserEmail().then(userename=>{
          if(userename!=null)
          {
            this.rootPage=AdminDashboardPage;
            authObserver.unsubscribe();
          }
          else
          {
            this.rootPage=AdminLoginPage;
            authObserver.unsubscribe();
          }
        });
      }
      else{
        this.rootPage=AdminLoginPage;
        authObserver.unsubscribe();
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
    this.nav.setRoot(page.component);
  }
}
