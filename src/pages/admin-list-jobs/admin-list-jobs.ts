import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AdminCreateJobsPage } from '../admin-create-jobs/admin-create-jobs'
import { TabsPage } from '../tabs/tabs';
import firebase  from 'firebase';
/**
 * Generated class for the AdminListJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: "list-jobs",
  segment: "admin/jobs"
})
@Component({
  selector: 'page-admin-list-jobs',
  templateUrl: 'admin-list-jobs.html',
})
export class AdminListJobsPage {
  @ViewChild(NavController) nav: NavController;
  pages: Array<{title: string, component: any}>;
  public jobRef: firebase.database.Reference = firebase.database().ref('jobs');
  public jobDetailsRef: firebase.database.Reference = firebase.database().ref();
  public job: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.pages = [
  	  { title: 'Dashboard', component: TabsPage },
      { title: 'List Jobs', component: AdminListJobsPage },
  	  { title: 'Add Job', component: AdminCreateJobsPage }
  	];
  }

  private filterOptions: any = {
    role: {
    },
    status: {
    }
  }

  private toggleDrop(filtertype: string): void{
    this.filterOptions[filtertype].open = !this.filterOptions[filtertype].open;
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.setRoot(page.component);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminListJobsPage');
  }

  goToAddJob(){
    this.navCtrl.setRoot(AdminCreateJobsPage)
  }



  ngOnInit() {
    let self=this
    this.jobRef.on('value', function (snapshot) {

      snapshot.forEach( itemSnap => {
        console.log(itemSnap.val())
        let job_details_id=itemSnap.val().job_details_id
        let designation='';
        // var userId = snapshot.val().userId; // line 1 (results like 1,2,3,4,5,6)
        console.log("job_details_id=="+job_details_id)
        // console.log(this.jobDetailsRef.child('job_details').child(job_details_id).val())
        // console.log(self.jobDetailsRef.child('job_details'))
        self.jobDetailsRef.child('job_details/').child(job_details_id).once('value', function(mediaSnap) {
            // console.log(mediaSnap.val());
            designation=mediaSnap.val().designation
        });
        self.job.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation})
        return false;
      });
      console.log(self.job)
    });
  }
}
