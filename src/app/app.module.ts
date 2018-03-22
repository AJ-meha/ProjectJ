import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, DeepLinkConfig } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';

import { CommonFunctionsProvider } from '../providers/common-functions/common-functions';
import { GlobalVarsProvider } from '../providers/global-vars/global-vars';
import { AuthProvider } from '../providers/auth/auth';
import { CustomerAuthProvider } from '../providers/customer-auth/customer-auth';
import { JobsProvider } from '../providers/jobs/jobs';
import { ImageProvider } from '../providers/image/image';
import { PreloaderProvider } from '../providers/preloader/preloader';

import { CustomerJobListingPage } from '../pages/customer-job-listing/customer-job-listing';
import { FavouritePage } from '../pages/favourite/favourite';
import { MessagePage } from '../pages/message/message';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';

// AF2 Settings
const firebaseConfig = {
  apiKey: "AIzaSyDMk-KBiuYXavz6yvoUk85oZ32JhN1IVVM",
  authDomain: "project-j-main.firebaseapp.com",
  databaseURL: "https://project-j-main.firebaseio.com",
  projectId: "project-j-main",
  storageBucket: "project-j-main.appspot.com",
  messagingSenderId: "569334041059"

};

//export const deepLinkConfig: DeepLinkConfig = {
//  links: [
//    { component: AdminCreateJobsPage, name: "create-jobs", segment: "admin/jobs/add" },
//    { component: AdminCreateJobsPage, name: "create-jobs", segment: "admin/jobs/edit/:id" },
//    { component: AdminListJobsPage, name: "list-jobs", segment: "admin/jobs" },
//    { component: CustomerSingleJobViewPage, name: "job", segment: "job/:id" },
//    { component: CustomerLoginPage, name: "customer-login", segment: "" },
//    { component: CustomerDashboardPage, name: "dashboard", segment: "dashboard" },
//  ]
//};

@NgModule({
  declarations: [
    MyApp,
    CustomerJobListingPage,
    FavouritePage,
    MessagePage,
    SearchPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CustomerJobListingPage,
    FavouritePage,
    MessagePage,
    SearchPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonFunctionsProvider,
    GlobalVarsProvider,
    AuthProvider,
    JobsProvider,
    CustomerAuthProvider,
    ImageProvider,
    PreloaderProvider
  ]
})
export class AppModule {}
