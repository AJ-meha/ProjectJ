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
  public logoImages={};
  public logostring={};
  public jobsfinal: Array<any> = [];
  public initialInd=0
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

  async ngOnInit(){
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
        console.log(data.json().data);
        this.jobs = data.json().data;
        
        let firstItem=this.jobs[this.initialInd]
       
        while(this.jobs[this.initialInd]["logo"] == undefined ){ 
          console.log("loop=="+this.jobs[0]["logo"])    
          self.jobsfinal.push({'jobstring':'','datestring':self.jobs[this.initialInd]["datestring"],'designation':self.jobs[this.initialInd]["designation"],'job_id':self.jobs[this.initialInd]["job_id"],'workplace_name':self.jobs[this.initialInd]["workplace_name"]})
          this.initialInd +=1
                   
        }
        console.log(this.initialInd)
        
        this.recFunc(this.initialInd)
       
        // for(var item in this.jobs){
        //   // self.logostring[self.jobs[item]["job_id"]]=''
        //   if(this.jobs[item]["logo"] !== undefined ){
        //     console.log("logo get =="+item)
            
        //   }
        // }
      });
      })
    }

  }

  openJob2() {
      this.navCtrl.push("single-job-details");
  }

  recFunc(item){
    let self=this
    if(this.jobs[this.initialInd]["logo"] !== undefined ){ 
      firebase.storage().ref().child(this.jobs[item]["logo"]).getDownloadURL().then(function(url) {
        console.log("url=="+url)
        self.jobs[item]["finalLogo"]=url
        
        self.logoImages[self.jobs[item]["job_id"]]=url
        self.jobs["jobstring"]='<img src="'+url+'" class="job-logo"/>';
        let jobstring='<img src="'+url+'" class="job-logo"/>';
        self.jobsfinal.push({'jobstring':jobstring,'datestring':self.jobs[item]["datestring"],'designation':self.jobs[item]["designation"],'job_id':self.jobs[item]["job_id"],'workplace_name':self.jobs[item]["workplace_name"]})
        console.log(self.jobsfinal)
        console.log(self.jobs.length+"=="+self.initialInd)
        if(self.jobs.length>self.initialInd){
          self.initialInd +=1
          return self.recFunc(self.initialInd)
        }
        else{
          return self.jobsfinal;
        }
        
      }).catch(function(error) {
        // Handle any errors here
      });
    }
    else{
      self.jobsfinal.push({'jobstring':'','datestring':self.jobs[this.initialInd]["datestring"],'designation':self.jobs[this.initialInd]["designation"],'job_id':self.jobs[this.initialInd]["job_id"],'workplace_name':self.jobs[this.initialInd]["workplace_name"]})
      if(self.jobs.length>self.initialInd){
        self.initialInd +=1
        return self.recFunc(self.initialInd)
      }
      else{
        return self.jobsfinal;
      }
    }
  }
            

}
