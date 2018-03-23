import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { FavouritePage } from '../favourite/favourite';
import { MessagePage } from '../message/message';
import { ProfilePage } from '../profile/profile';

@IonicPage(
  {
    name: "home",
  	segment: 'home',
  }
)

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'page-search';
  tab2Root = FavouritePage;
  tab3Root = MessagePage;
  tab4Root = ProfilePage;

  constructor() {

  }
}
