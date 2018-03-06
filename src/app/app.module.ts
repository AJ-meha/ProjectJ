import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FavouritePage } from '../pages/favourite/favourite';
import { MessagePage } from '../pages/message/message';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

// AF2 Settings
const firebaseConfig = {
  apiKey: "AIzaSyAVEQQy09_jXpvnlZI93gfcoGG0ARhyUgM",
  authDomain: "projectj-6747f.firebaseapp.com",
  databaseURL: "https://projectj-6747f.firebaseio.com",
  storageBucket: "projectj-6747f.appspot.com",
  messagingSenderId: "913702739246"
};

@NgModule({
  declarations: [
    MyApp,
    FavouritePage,
    MessagePage,
    SearchPage,
    ProfilePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FavouritePage,
    MessagePage,
    SearchPage,
    ProfilePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
