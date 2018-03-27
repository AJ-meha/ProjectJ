import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage(
  {
    name: "home",
    segment: "home"
  }
)
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }


  openPage(){
    this.navCtrl.push('login');
  }
}
