import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import firebase  from 'firebase';
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
  public typeRef: firebase.database.Reference = firebase.database().ref('type');
  public dbRef: firebase.database.Reference = firebase.database().ref();
  public job: Array<any> = [];
  public empTypes: Array<any> = [];
  public types: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
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


    this.dbRef.child('jobs/').child(this.id).once('value').then( function(itemSnap) {
          console.log(itemSnap.val())
          let job_details_id=itemSnap.val().job_details_id
          let job_contact_workplace_id=itemSnap.val().jobs_contact_workplace_id
          let designation='';
          let employment_type='';
          let salary_amount='';
          let type='';
          let industry='';
          let sub_industry='';
          // var userId = snapshot.val().userId; // line 1 (results like 1,2,3,4,5,6)
          // console.log("job_details_id=="+job_details_id)
          // console.log(this.jobDetailsRef.child('job_details').child(job_details_id).val())
          // console.log(self.jobDetailsRef.child('job_details'))
          self.dbRef.child('job_details/').child(job_details_id).once('value').then( function(mediaSnap) {
              // console.log(mediaSnap.val());
              designation=mediaSnap.val().designation
              employment_type=mediaSnap.val().employment_type
              type=mediaSnap.val().type
              salary_amount=mediaSnap.val().salary_amount
              industry=mediaSnap.val().industry
              sub_industry=mediaSnap.val().sub_industry

              self.dbRef.child('jobs_contact_workplace/').child(job_contact_workplace_id).once('value').then( function(jobContactSnap) {
                self.job['key']=itemSnap.key;
                self.job['value']=itemSnap.val();
                self.job['designation']=designation;
                
                self.job['employment_type']=employment_type;
                self.job['workplace_name']=jobContactSnap.val().workplace_name
                self.job['workplace_address']=jobContactSnap.val().workplace_address
                self.job['salary_amount']=salary_amount;
                self.dbRef.child('type/').child(type).once('value').then( function(typesSnap) {
                  self.job['type']=typesSnap.val().text;
                });
                self.dbRef.child('industry/').child(industry).once('value').then( function(typesSnap) {
                  self.job['industry']=typesSnap.val();
                });
                self.dbRef.child('industry_subindustry/').child(industry).child(sub_industry).once('value').then( function(subtypesSnap) {
                  self.job['sub_industry']=subtypesSnap.val();
                });
              });
              
              
          });
      console.log(self.job)
    });
  }

}
