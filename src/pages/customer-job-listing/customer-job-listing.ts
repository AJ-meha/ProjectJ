import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import { CustomerLoginPage } from '../customer-login/customer-login';
import { CustomerSingleJobViewPage } from '../customer-single-job-view/customer-single-job-view';
import { SingleJob_2Page } from '../single-job-2/single-job-2';
import firebase  from 'firebase';

/**
 * Generated class for the CustomerJobListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-job-listing',
  templateUrl: 'customer-job-listing.html',
})
export class CustomerJobListingPage {
  public jobRef: firebase.database.Reference = firebase.database().ref('jobs');
  public jobs: Array<any> = [];
  public dbRef: firebase.database.Reference = firebase.database().ref();
  constructor(public navCtrl: NavController, public navParams: NavParams,public authData:CustomerAuthProvider,public modalCtrl:ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerJobListingPage');
  }

  logOut(){
    this.authData.logoutUser().then(authData=>{
      this.navCtrl.setRoot(CustomerLoginPage);
      //this.navCtrl.popAll();
      //this.navCtrl.push("LoginPage");
    });
  }

  openModal() {
    let modal = this.modalCtrl.create('ModalPage');
    modal.present();
  }

  openJob(idval) {
    this.navCtrl.push(CustomerSingleJobViewPage,{
      id: idval
    });
  }

  ngOnInit(){
    let self=this
    this.jobRef.on('value', function (snapshot) {

      snapshot.forEach( itemSnap => {
        console.log(itemSnap.key)
        let job_details_id=itemSnap.val().job_details_id
        let designation='';
        self.dbRef.child('job_details/').child(job_details_id).once('value').then( function(mediaSnap) {
            // console.log(mediaSnap.val());
            designation=mediaSnap.val().designation
            self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation})

        });
        // self.jobs.push({'key':itemSnap.key,'value':itemSnap.val()})
        return false;
      });

    });
  }

  openJob2() {
      this.navCtrl.push(SingleJob_2Page);
  }

}
