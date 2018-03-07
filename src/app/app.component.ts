import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AdminLoginPage } from '../pages/admin-login/admin-login';
import { AdminDashboardPage } from '../pages/admin-dashboard/admin-dashboard';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth) {
    const authObserver=afAuth.authState.subscribe(user=>{
      if(user){
        this.rootPage=AdminDashboardPage;
        authObserver.unsubscribe();
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
}
