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
  public allJobStatus: Array<any> = [];
  public selectedStatusArray: Array<any> = [];
  public selectedSubIndArray: Array<any> = [];
  @ViewChild(NavController) nav: NavController;
  pages: Array<{title: string, component: any}>;
  public jobRef: firebase.database.Reference = firebase.database().ref('jobs');
  public jobStatusRef: firebase.database.Reference = firebase.database().ref('jobs_status');
  public indSubIndRef: firebase.database.Reference = firebase.database().ref('industry_subindustry');
  public jobDetailsRef: firebase.database.Reference = firebase.database().ref();
  public jobs: Array<any> = [];
  public jobStatuses: Array<any> = [];
  public indSubInd: Array<any> = [];
  autocomplete:any
  searchstring:string=""
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.autocomplete = { input: '' };
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

    this.initLoad()
    this.jobStatusRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.jobStatuses[ikey]=ival
        this.allJobStatus.push({'key':ikey,'value':ival})
        return false;
      });
    });

    this.indSubIndRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        for (let key in ival) {
          let value = ival[key];
          this.indSubInd.push({'key':key,'value':value})
          // Use `key` and `value`
        }
        
        return false;
      });
    });
    
  }

  initLoad(){
    this.jobs=[]
    let self=this
    // this.jobRef.su
    this.jobRef.on('value', function (snapshot) {

      snapshot.forEach( itemSnap => {
        console.log(itemSnap.key)
        let job_details_id=itemSnap.val().job_details_id
        let designation='';
        // var userId = snapshot.val().userId; // line 1 (results like 1,2,3,4,5,6)
        // console.log("job_details_id=="+job_details_id)
        // console.log(this.jobDetailsRef.child('job_details').child(job_details_id).val())
        // console.log(self.jobDetailsRef.child('job_details'))
        self.jobDetailsRef.child('job_details/').child(job_details_id).once('value').then( function(mediaSnap) {
            // console.log(mediaSnap.val());
            designation=mediaSnap.val().designation
            let sub_industry=mediaSnap.val().sub_industry
            let industry=mediaSnap.val().industry
            if(sub_industry==""){
              self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
            }
            else{
              self.jobDetailsRef.child('industry_subindustry').child(industry).child(sub_industry).once('value').then( function(subindSnap) {
                // console.log(subindSnap.val())
                self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
              });
            }
            

        });
        // self.jobs.push({'key':itemSnap.key,'value':itemSnap.val()})
        return false;
      });
      
    });
  }

  resetFilter(){
    this.jobs=[]
    this.initLoad()
    this.autocomplete.input=''
  }


  updateStatusFilter(key, isChecked, index) {
    console.log("ischecked=="+isChecked)
   if(isChecked) {
    this.selectedStatusArray.push(key)
   } else {
    const index: number = this.selectedStatusArray.indexOf(key);
    if (index !== -1) {
        this.selectedStatusArray.splice(index, 1);
    }   
   }
   console.log(this.selectedStatusArray)
 }

 updateSubIndFilter(key, isChecked, index) {
 if(isChecked) {
  this.selectedSubIndArray.push(key)
 } else {
  const index: number = this.selectedSubIndArray.indexOf(key);
  if (index !== -1) {
      this.selectedSubIndArray.splice(index, 1);
  }   
 }
 console.log("selectedSubIndArray===")
 console.log(this.selectedSubIndArray)
}



 applyFilter(){
  this.jobs=[]
  let self=this
  this.jobRef.on('value', function (snapshot) {

    snapshot.forEach( itemSnap => {
      // console.log(itemSnap.val())
      let job_details_id=itemSnap.val().job_details_id
      let designation='';
      // var userId = snapshot.val().userId; // line 1 (results like 1,2,3,4,5,6)
      // console.log("job_details_id=="+job_details_id)
      // console.log(this.jobDetailsRef.child('job_details').child(job_details_id).val())
      // console.log(self.jobDetailsRef.child('job_details'))
      self.jobDetailsRef.child('job_details/').child(job_details_id).once('value').then( function(mediaSnap) {
          // console.log(mediaSnap.val());
          designation=mediaSnap.val().designation
          let sub_industry=mediaSnap.val().sub_industry
          let industry=mediaSnap.val().industry
          if(sub_industry==""){
            if(self.searchstring!=""){
              
              if(designation.toLowerCase().indexOf(self.searchstring.toLowerCase()) != -1){
                if(self.selectedStatusArray.length>0 || self.selectedSubIndArray.length>0){
                  // if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length<=0) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                  //   self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                  // }
  
                  if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length<=0) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                    self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                  }
                  else if((self.selectedStatusArray.length<=0 && self.selectedSubIndArray.length>0) && (self.selectedSubIndArray.indexOf(sub_industry) > -1)){
                    self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                  }
                  else if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length>0) && (self.selectedSubIndArray.indexOf(sub_industry) > -1) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                    self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                  }
                }
                else{
                  self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                }
                
              }
              
            }
            else{
             
              if(self.selectedStatusArray.length>0 || self.selectedSubIndArray.length>0){
                // if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length<=0) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                //   self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                // }

                if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length<=0) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                  self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                }
                else if((self.selectedStatusArray.length<=0 && self.selectedSubIndArray.length>0) && (self.selectedSubIndArray.indexOf(sub_industry) > -1)){
                  self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                }
                else if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length>0) && (self.selectedSubIndArray.indexOf(sub_industry) > -1) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                  self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
                }
              }
              else{
                self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':"---"})
              }
            }
          }
          else{
            self.jobDetailsRef.child('industry_subindustry').child(industry).child(sub_industry).once('value').then( function(subindSnap) {
              // console.log(designation.indexOf(self.searchstring))
              
              if(self.searchstring!=""){
                
                if(designation.toLowerCase().indexOf(self.searchstring.toLowerCase()) != -1){
                  if(self.selectedStatusArray.length>0 || self.selectedSubIndArray.length>0){
                    if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length<=0) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                      self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
                    }
                    else if((self.selectedStatusArray.length<=0 && self.selectedSubIndArray.length>0) && (self.selectedSubIndArray.indexOf(sub_industry) > -1)){
                      self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
                    }
                    else if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length>0) && (self.selectedSubIndArray.indexOf(sub_industry) > -1) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                      self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
                    }
                  }
                  else{
                    self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
                  }
                  
                }
                
              }
              else{
               
                if(self.selectedStatusArray.length>0 || self.selectedSubIndArray.length>0){
                  if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length<=0) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                    self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
                  }
                  else if((self.selectedStatusArray.length<=0 && self.selectedSubIndArray.length>0) && (self.selectedSubIndArray.indexOf(sub_industry) > -1)){
                    self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
                  }
                  else if((self.selectedStatusArray.length>0 && self.selectedSubIndArray.length>0) && (self.selectedSubIndArray.indexOf(sub_industry) > -1) && (self.selectedStatusArray.indexOf(itemSnap.val().job_status) > -1)){
                    self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
                  }
                }
                else{
                  self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation,'industry':industry,'sub_industry':subindSnap.val()})
                }
              }
              
              //
              
            });
          }
          
      });
      // self.jobs.push({'key':itemSnap.key,'value':itemSnap.val()})
      return false;
    });
    
  });
 }

 updateSearchResults(){
  this.searchstring=this.autocomplete.input
  this.applyFilter()
 }

}
