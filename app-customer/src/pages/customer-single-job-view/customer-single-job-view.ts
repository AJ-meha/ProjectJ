import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import firebase  from 'firebase';
import { Http,Headers } from '@angular/http';
/**
 * Generated class for the CustomerSingleJobViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: "job",
    segment: "job/:id"
  }
)
@Component({
  selector: 'page-customer-single-job-view',
  templateUrl: 'customer-single-job-view.html',
})
export class CustomerSingleJobViewPage {
  public id:string;
  public savedJobsRef: firebase.database.Reference = firebase.database().ref('jobs');
  public empTypeRef: firebase.database.Reference = firebase.database().ref('employment_type');
  public dbRef: firebase.database.Reference = firebase.database().ref();
  public job: Array<any> = [];
  public empTypes: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,private http:Http) {
    console.log("id="+ this.navParams.get('id'))
    this.id=this.navParams.get('id')
  }

  ionViewDidLoad() {
    this.viewCtrl.showBackButton(false);
  }

  openDetails() {
      this.navCtrl.push("job-details");
  }

  openBenefits() {
      this.navCtrl.push("job-benefits");
  }

  goBack() {
      this.navCtrl.pop();
  }

  ngOnInit(){
    let self=this
    this.empTypeRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.empTypes[ikey]=ival
        return false;
      });
    });
    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Accept' , 'application/json');
    headers.append('Content-Type' , 'application/json');
    // headers.append('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // headers.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Auth-Token, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    this.http.get(' https://us-central1-project-j-main.cloudfunctions.net/jobdetails?job_id='+this.id,{ headers: headers })
    .subscribe((data) => {
      console.log('data==')
      console.log(data.json().data);
      this.job = data.json().data;
    })

  }

}
