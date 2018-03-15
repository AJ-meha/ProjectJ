import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, DeepLinkConfig } from 'ionic-angular';
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
import { AdminListJobsPage } from '../pages/admin-list-jobs/admin-list-jobs';


// AF2 Settings
const firebaseConfig = {
  apiKey: "AIzaSyDMk-KBiuYXavz6yvoUk85oZ32JhN1IVVM",
  authDomain: "project-j-main.firebaseapp.com",
  databaseURL: "https://project-j-main.firebaseio.com",
  projectId: "project-j-main",
  storageBucket: "project-j-main.appspot.com",
  messagingSenderId: "569334041059"

};

export const deepLinkConfig: DeepLinkConfig = {
  links: [
    { component: AdminCreateJobsPage, name: "create-jobs", segment: "admin/jobs/add" },
    { component: AdminCreateJobsPage, name: "create-jobs", segment: "admin/jobs/edit/:id" },
    { component: AdminListJobsPage, name: "list-jobs", segment: "admin/jobs" },
  ]
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
    AdminCreateJobsPage,
    AdminListJobsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios'
    },deepLinkConfig),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot(),
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
    AdminCreateJobsPage,
    AdminListJobsPage
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
