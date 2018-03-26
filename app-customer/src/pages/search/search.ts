import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';

@IonicPage(
  {
    name: 'page-search',
  	segment: 'page-search'
  }
)

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

	openJob() {
	    this.navCtrl.push('single-job');
	}

	openJob2() {
	    this.navCtrl.push('single-job-details');
	}

}
