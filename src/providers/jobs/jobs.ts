import { Injectable } from '@angular/core';

/*
  Generated class for the JobsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class JobsProvider {
  public jobs: Array<any> = [];
  public jobRef:any
  public jobDetailsRef:any
  constructor() {
    this.jobRef= firebase.database().ref('jobs');
    this.jobDetailsRef=firebase.database().ref();
  }

  getjobs() {
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
            console.log("desig=="+mediaSnap.val().designation);
            designation=mediaSnap.val().designation
            self.jobs.push({'key':itemSnap.key,'value':itemSnap.val(),'designation':designation})
        });
        
        return false;
      });
      return self.jobs;
    });

    console.log(self.jobs)
  }

}
