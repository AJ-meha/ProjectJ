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
import { SingleJobPage } from '../pages/single-job/single-job';
import { JobBenefitsPage } from '../pages/job-benefits/job-benefits';
import { JobDetailsPage } from '../pages/job-details/job-details';
import { SingleJob_2Page } from '../pages/single-job-2/single-job-2';
import { JobsProvider } from '../providers/jobs/jobs';
import { CustomerAuthProvider } from '../providers/customer-auth/customer-auth';
import { CustomerLoginPage } from '../pages/customer-login/customer-login';
import { CustomerSingleJobViewPage } from '../pages/customer-single-job-view/customer-single-job-view';
import { CustomerJobListingPage } from '../pages/customer-job-listing/customer-job-listing';
import { CustomerDashboardPage } from '../pages/customer-dashboard/customer-dashboard';
import { ImageProvider } from '../providers/image/image';
import { Camera } from '@ionic-native/camera';
import { PreloaderProvider } from '../providers/preloader/preloader';

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
    { component: CustomerSingleJobViewPage, name: "job", segment: "job/:id" },
    { component: CustomerLoginPage, name: "customer-login", segment: "" },
    { component: CustomerDashboardPage, name: "dashboard", segment: "dashboard" },
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
    AdminListJobsPage,
    SingleJobPage,
    JobBenefitsPage,
    JobDetailsPage,
    SingleJob_2Page,
    CustomerLoginPage,
    CustomerSingleJobViewPage,
    CustomerJobListingPage,
    CustomerDashboardPage
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
    AdminListJobsPage,
    SingleJobPage,
    JobBenefitsPage,
    JobDetailsPage,
    SingleJob_2Page,
    CustomerLoginPage,
    CustomerSingleJobViewPage,
    CustomerJobListingPage,
    CustomerDashboardPage
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
