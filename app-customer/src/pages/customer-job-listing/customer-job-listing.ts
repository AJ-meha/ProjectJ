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

 

  openModal() {
    let modal = this.modalCtrl.create('ModalPage');
    modal.present();
  }

  openJob(idval) {

    this.navCtrl.push("job",{
      id: idval
    });
  }

  ngOnInit(){
    let self=this
    var headers = new Headers();
    if(firebase.auth().currentUser !== null){
      firebase.auth().currentUser.getIdToken()
      .then(authToken => {
        console.log("auth token==="+authToken); 
      headers.append('Authorization','Bearer '+authToken)
      headers.append('Access-Control-Allow-Origin' , '*');
      headers.append('Accept' , 'application/json');
      headers.append('Content-Type' , 'application/json');
      // headers.append('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
      // headers.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Auth-Token, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
      this.http.get(' https://us-central1-project-j-main.cloudfunctions.net/jobs',{ headers: headers })
      .subscribe((data) => {
        console.log('data=='+data.json().data);
        this.jobs = data.json().data;
        for(var item in this.jobs){
          if(this.jobs[item]["logo"] !== undefined ){
            firebase.storage().ref().child(this.jobs[item]["logo"]).getDownloadURL().then(function(url) {
              this.jobs[item]["finalLogo"]=url
              console.log("url=="+url)
            }).catch(function(error) {
              // Handle any errors here
            });
          }
        }
      });
      })
    }

  }

  openJob2() {
      this.navCtrl.push("single-job-details");
  }

            

}
