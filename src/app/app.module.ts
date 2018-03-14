import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FavouritePage } from '../pages/favourite/favourite';
import { MessagePage } from '../pages/message/message';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { AdminLoginPage } from '../pages/admin-login/admin-login';
import { AdminDashboardPage } from '../pages/admin-dashboard/admin-dashboard';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { CommonFunctionsProvider } from '../providers/common-functions/common-functions';
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';

import { AuthProvider } from '../providers/auth/auth';

import { IonicStorageModule } from '@ionic/storage';
import { AdminCreateJobsPage } from '../pages/admin-create-jobs/admin-create-jobs';


// AF2 Settings
const firebaseConfig = {
  apiKey: "AIzaSyAYyvV52MZ6hOag6q411xOAoPQQ3rkVTV8",
  authDomain: "project-j-2018.firebaseapp.com",
  databaseURL: "https://project-j-2018.firebaseio.com",
  projectId: "project-j-2018",
  storageBucket: "project-j-2018.appspot.com",
  messagingSenderId: "374829001586"

};

@NgModule({
  declarations: [
    MyApp,
    FavouritePage,
    MessagePage,
    SearchPage,
    ProfilePage,
    TabsPage,
    AdminLoginPage,
    AdminDashboardPage,
    AdminCreateJobsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FavouritePage,
    MessagePage,
    SearchPage,
    ProfilePage,
    TabsPage,
    AdminLoginPage,
    AdminDashboardPage,
    AdminCreateJobsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonFunctionsProvider,
    GlobalVarsProvider,
    AuthProvider
  ]
})
export class AppModule {}
