import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicStorageModule } from '@ionic/storage';

import { CommonFunctionsProvider } from '../providers/common-functions/common-functions';
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';
import { CustomerAuthProvider } from '../providers/customer-auth/customer-auth';
import { FavouritePage } from '../pages/favourite/favourite';
import { MessagePage } from '../pages/message/message';
import { ProfilePage } from '../pages/profile/profile';
import { CustomerJobListingPage } from '../pages/customer-job-listing/customer-job-listing';
// AF2 Settings
const firebaseConfig = {
  apiKey: "AIzaSyDMk-KBiuYXavz6yvoUk85oZ32JhN1IVVM",
  authDomain: "project-j-main.firebaseapp.com",
  databaseURL: "https://project-j-main.firebaseio.com",
  projectId: "project-j-main",
  storageBucket: "project-j-main.appspot.com",
  messagingSenderId: "569334041059"

};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CustomerJobListingPage,
    FavouritePage,
    MessagePage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CustomerJobListingPage,
    FavouritePage,
    MessagePage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonFunctionsProvider,
    GlobalVarsProvider,
    CustomerAuthProvider
  ]
})
export class AppModule {}
