import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }

  	openModal() {
	    let modal = this.modalCtrl.create('ModalPage');
	    modal.present();
	}

	openDetails() {
	    this.navCtrl.push('DemoPage');
	}

}
