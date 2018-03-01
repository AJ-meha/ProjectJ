import { Component } from '@angular/core';

import { FavouritePage } from '../favourite/favourite';
import { MessagePage } from '../message/message';
import { SearchPage } from '../search/search';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = SearchPage;
  tab2Root = FavouritePage;
  tab3Root = MessagePage;
  tab4Root = ProfilePage;

  constructor() {

  }
}
