import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import firebase  from 'firebase';
import { Http,Headers } from '@angular/http';
import { CustomerAuthProvider } from '../../providers/customer-auth/customer-auth';
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
  public empTypeRef: firebase.database.Reference = firebase.database().ref('employment_type');
  public typeRef: firebase.database.Reference = firebase.database().ref('type');
  public industryRef: firebase.database.Reference = firebase.database().ref('industry');
  public subindustryRef: firebase.database.Reference = firebase.database().ref('industry_subindustry');
  public empBenRef: firebase.database.Reference = firebase.database().ref('employee_benefits');
  public dbRef: firebase.database.Reference = firebase.database().ref();
  public job: Array<any> = [];
  public empTypes: Array<any> = [];
  public types: Array<any> = [];
  public empBenefits: Array<any> = [];
  public industries: Array<any> = [];
  public subindustries: Array<any> = [];
  public empBen: Array<any> =[];
  public smallThumbLogo='';
  public bigThumbLogo='';

  constructor(public navCtrl: NavController, public navParams: NavParams,public authData:CustomerAuthProvider, public viewCtrl: ViewController,private http:Http) {
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

    this.typeRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.types[ikey]=ival["text"]
        return false;
      });
      console.log(this.types)
    });

    this.industryRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.industries[ikey]=ival
        return false;
      });
      console.log(this.industries)
    });

    this.empBenRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.empBenefits[ikey]=ival["text"]
        return false;
      });
      console.log(this.empBenefits)
    });

    var headers = new Headers();
    if(firebase.auth().currentUser !== null){
      firebase.auth().currentUser.getIdToken()
      .then(authToken => {
        headers.append('Authorization','Bearer '+authToken)
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
        if(this.job['employee_benefits'] !== undefined){
          console.log(this.job['employee_benefits'])
          var jobkey;
          for(jobkey in this.job['employee_benefits']){
            console.log("key=="+jobkey)
            this.empBen.push(jobkey)
          }
        }
        if(this.job['logos'] !== undefined){
          console.log("logos exist!!!")
          console.log( this.job['logos'])
          for(var logokey in this.job['logos']){
            console.log("logo==="+logokey+"---"+this.job["logos"][logokey])
            let keyvalue=logokey
            firebase.storage().ref().child(this.job["logos"][logokey]).getDownloadURL().then(function(url) {
              console.log("thumb logo==="+parseInt(keyvalue))
              if(parseInt(keyvalue) == 40){
                console.log("size 40===")
                self.smallThumbLogo=url
              }
              else{
                self.bigThumbLogo=url
              }
              console.log("smallThumbLogo=="+self.smallThumbLogo)
              console.log("bigThumbLogo==="+self.bigThumbLogo)
              
            }).catch(function(error) {
              // Handle any errors here
            });
          }

        }

        
        this.dbRef.child('industry_subindustry/').child(this.job['industry']).on('value', itemSnapshot => {
          itemSnapshot.forEach( itemSnap => {
            let ikey=itemSnap.key
            let ival=itemSnap.val()
            this.subindustries[ikey]=ival
            return false;
          });
          console.log(this.subindustries)
        });
      })
       })
    }
    

  }

}
