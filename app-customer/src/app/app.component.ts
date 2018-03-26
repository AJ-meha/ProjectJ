import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { CustomerAuthProvider } from '../providers/customer-auth/customer-auth';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  @ViewChild(Nav) nav: Nav;
  public is_admin:boolean=false
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth,public customerAuthData:CustomerAuthProvider) {
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

    });
  }
}

