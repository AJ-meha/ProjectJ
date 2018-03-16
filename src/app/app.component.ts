import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { AdminLoginPage } from '../pages/admin-login/admin-login';
import { AdminDashboardPage } from '../pages/admin-dashboard/admin-dashboard';

import { AngularFireAuth } from 'angularfire2/auth';

import { AuthProvider } from '../providers/auth/auth';
import { AdminCreateJobsPage } from '../pages/admin-create-jobs/admin-create-jobs';
import { AdminListJobsPage } from '../pages/admin-list-jobs/admin-list-jobs';
import { CustomerLoginPage } from '../pages/customer-login/customer-login';
import { CustomerSingleJobViewPage } from '../pages/customer-single-job-view/customer-single-job-view';
import { CustomerAuthProvider } from '../providers/customer-auth/customer-auth';
import { CustomerJobListingPage } from '../pages/customer-job-listing/customer-job-listing';
import { CustomerJobListingPage } from '../pages/customer-job-listing/customer-job-listing';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title:string,component:any}>;
  public is_admin:boolean=false
  constructor(public app:App,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth: AngularFireAuth,public authData:AuthProvider,public customerAuthData:CustomerAuthProvider) {
    this.pages=[
      {title:'Dashboard',component:AdminDashboardPage},
      {title:'Add Job',component:AdminCreateJobsPage},
      {title:'View Jobs',component:TabsPage},
      {title:'List Jobs',component:AdminListJobsPage}
    ];
    console.log("loc="+window.location.href)
    if(window.location.href.indexOf('#/admin') != -1){
      this.is_admin=true
    }
      
    
    if(this.is_admin == true){
      this.rootPage=AdminLoginPage;
    }
    else{
      this.rootPage=CustomerLoginPage;
    }
    
    this.authData.getUserEmail().then(userename=>{
      if(this.is_admin ==true && userename!=null)
      {
        this.rootPage=AdminDashboardPage;
       
      }
      else
      {
        if(this.is_admin ==true){
          this.rootPage=AdminLoginPage;
        }
          
       
      }
    });

    const authObserver=afAuth.authState.subscribe(user=>{
      if(user){
        this.customerAuthData.getUserPhone().then(userphone=>{
          if(this.is_admin ==false && userphone!=null)
          {
            this.rootPage=CustomerLoginPage;
            authObserver.unsubscribe();
          }
          else
          {
            if(this.is_admin ==false){
              this.rootPage=CustomerJobListingPage;
              authObserver.unsubscribe();
            }
            
          }
        });
      }
      else{
        if(this.is_admin ==false){
          this.rootPage=CustomerLoginPage;
          authObserver.unsubscribe();
        }
        
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
