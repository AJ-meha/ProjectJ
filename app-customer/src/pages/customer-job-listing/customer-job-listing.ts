import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
import firebase  from 'firebase';
import { Http,Headers } from '@angular/http';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the CustomerJobListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customer-job-listing',
  templateUrl: 'customer-job-listing.html',
})
export class CustomerJobListingPage {
  public jobRef: firebase.database.Reference = firebase.database().ref('jobs');
  public jobs: Array<any> = [];
  public dbRef: firebase.database.Reference = firebase.database().ref();
  constructor(public navCtrl: NavController, public navParams: NavParams,public authData:CustomerAuthProvider,public modalCtrl:ModalController,private http:Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerJobListingPage');
  }

  logOut(){
    this.authData.logoutUser().then(authData=>{
      this.navCtrl.setRoot("login");
      //this.navCtrl.popAll();
      //this.navCtrl.push("login");
    });
  }

  openModal() {
    let modal = this.modalCtrl.create('ModalPage');
    modal.present();
  }

  openJob(idval) {
    firebase.auth().currentUser.getIdToken()
    .then(authToken => {
      const headers = new Headers({'Authorization': 'Bearer ' + authToken });
      console.log("authToken==="+authToken)

      const myUID    = { uid: 'current-user-uid' };    // success 200 response
      const notMyUID = { uid: 'some-other-user-uid' }; // error 403 response
      
      // return this.http.get(url, { headers: headers }).toPromise()
    })
    this.navCtrl.push("job",{
      id: idval
    });
  }

  ngOnInit(){
    let self=this
    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Accept' , 'application/json');
    headers.append('Content-Type' , 'application/json');
    // headers.append('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // headers.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Auth-Token, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    this.http.get(' https://us-central1-project-j-main.cloudfunctions.net/jobs',{ headers: headers })
    .subscribe((data) => {
      console.log('data=='+data.json().data);
      this.jobs = data.json().data;
    })
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
      this.navCtrl.push("single-job-details");
  }

            

}
