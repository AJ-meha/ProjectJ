import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase  from 'firebase';

import { CommonFunctionsProvider } from '../../providers/common-functions/common-functions';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { ImageProvider } from '../../providers/image/image';
import { Upload } from '../../app/models/upload';

/**
 * Generated class for the AdminCreateJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: "admin-create-jobs",
    segment: "admin/jobs/:action/:id"
  }
)
@Component({
  selector: 'page-admin-create-jobs',
  templateUrl: 'admin-create-jobs.html',
})
export class AdminCreateJobsPage {
  inputsArray = {application_sent_mail:'',mobile:'',workplace:'',workplace_address:'',workplace_name:'',workplace_latitude:'',workplace_longitude:'',designation:'',industry:'',salary_amount:'',salary_unit:'',sub_industry:'',type:'',employment_type:'',additional_info:'',night_shift:false,question:"no"};
  timeArray = {mon:{start_time:"",end_time:"",holiday:false,shift_end:"mon"},tue:{start_time:"",end_time:"",holiday:false,shift_end:"tue"},wed:{start_time:"",end_time:"",holiday:false,shift_end:"wed"},thu:{start_time:"",end_time:"",holiday:false,shift_end:"thu"},fri:{start_time:"",end_time:"",holiday:false,shift_end:"fri"},sat:{start_time:"",end_time:"",holiday:false,shift_end:"sat"},sun:{start_time:"",end_time:"",holiday:false,shift_end:"sun"}};
  daysArray = GlobalVarsProvider.daysArray;
  employeeBenefitsArray: Array<any> = [];
  questionsArray: Array<any> = [{question_name:"",option_type:"radio",options:[{val:""}]}];
  max_option = GlobalVarsProvider.max_option;
  mobile_code = GlobalVarsProvider.mobile_code;
  jobsForm:FormGroup;
  contactVias: Array<any> = [];
  workplaceTypes: Array<any> = [];
  empTypes: Array<any> = [];
  types: Array<any> = [];
  salaryUnits: Array<any> = [];
  employeeBenefits: Array<any> = [];
  industries: Array<any> = [];
  subindustries: Array<any> = [];
  contactViaList:FormArray;
  contactViaArray = [];
  selectedContactViaArray = [];
  public jobContactViaRef: firebase.database.Reference = firebase.database().ref('job_contact_via');
  public workplacetypeViaRef: firebase.database.Reference = firebase.database().ref('workplace_type');
  public emptypeViaRef: firebase.database.Reference = firebase.database().ref('employment_type');
  public typeRef: firebase.database.Reference = firebase.database().ref('type');
  public salaryUnitRef: firebase.database.Reference = firebase.database().ref('salary_unit');
  public industryRef: firebase.database.Reference = firebase.database().ref('industry');
  public employeeBenefitsRef: firebase.database.Reference = firebase.database().ref('employee_benefits');

  public dbRef: firebase.database.Reference = firebase.database().ref();
  public savedJobsRef: firebase.database.Reference = firebase.database().ref('jobs');
  public jobImage  	   : any;
  
  selectedFiles: FileList;
  currentUpload: Upload;
  existingUpload:string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private af: AngularFireDatabase,public formBuilder:FormBuilder,public commonfunc:CommonFunctionsProvider, public authData:AuthProvider,private _IMG: ImageProvider) {

    let self=this;
    this.authData.getUserEmail().then(useremail=>{
      if(useremail==null)
      {
        self.authData.setAdminInit(window.location.href);
        self.navCtrl.setRoot("admin-login");
      }
    });

    // console.log("jobss---")
    console.log("id=")
    this.jobsForm=this.formBuilder.group({
      application_sent_mail:['',Validators.compose([Validators.required,EmailValidator.isValid])],
      workplace:['',Validators.compose([Validators.required])],
      workplace_name:['',Validators.compose([Validators.required])],
      workplace_address:['',Validators.compose([Validators.required])],
      workplace_latitude:['',Validators.compose([Validators.required])],
      workplace_longitude:['',Validators.compose([Validators.required])],
      mobile:['',Validators.compose([Validators.required,Validators.pattern('\\d{10}$')])],
      designation:['',Validators.compose([Validators.required])],
      type:['',Validators.compose([Validators.required])],
      salary_amount:['',Validators.compose([Validators.required,Validators.pattern('[1-9]+[0-9]*')])],
      salary_unit:['',Validators.compose([Validators.required])],
      industry:['',Validators.compose([Validators.required])],
      sub_industry:['',Validators.compose([Validators.required])],
      employment_type:['',Validators.compose([Validators.required])],
      contact_via:['',Validators.compose([Validators.required])],
      additional_info:'',
      image:''
      // contactViaList:this.formBuilder.array([])
      // contactViaList:this.formBuilder.array([])

    });

  }

  ionViewDidLoad() {

  }


  ngOnInit() {
    console.log("mail=="+GlobalVarsProvider.from_email)
    let contactViaArray = [];
    // console.log('ionViewDidLoad AdminCreateJobsPage');
    this.workplacetypeViaRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.workplaceTypes.push({"key":ikey,"value":ival})
        return false;
      });
      console.log(this.workplaceTypes)
    });

    this.industryRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.industries.push({"key":ikey,"value":ival})
        return false;
      });
      console.log(this.industries)
    });

    this.emptypeViaRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.empTypes.push({"key":ikey,"value":ival})
        return false;
      });
    });

    this.typeRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.types.push({"key":ikey,"value":ival})
        return false;
      });
    });

    this.salaryUnitRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.salaryUnits.push({"key":ikey,"value":ival})
        return false;
      });
    });
    let stepCounter=0;
    let isChecked=false;
    this.jobContactViaRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {

        console.log(itemSnap.key+"=="+itemSnap.val())
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        if(stepCounter == 0){
          this.selectedContactViaArray.push(ikey);
          isChecked=true;
        }
        else{
          isChecked=false;
        }
        this.contactVias.push({"key":ikey,"value":ival,"checked":isChecked})
        
        stepCounter +=1;
        let cform=this.formBuilder.group({
          contact_via: false,
          name: ival,
          slug: ikey
        });
        // (this.jobsForm.get('contactViaList') as FormArray).push(cform);
        return false;
      });
      console.log("list====")

      // this.contactViaList=this.formBuilder.array(this.contactViaArray)
      // console.log(this.contactViaList)
    });

    this.employeeBenefitsRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.employeeBenefits.push({"key":ikey,"value":ival});
        this.employeeBenefitsArray[ikey]={"checkbox":false,"details":""};
        return false;
      });
      console.log("employeeBenefits===");

      //VIRAJ - Put inside to get saved data after everything loads
      if(this.navParams.get('action')=="edit")
      {
        this.getData();
      }
    });

    // let cformContact=this.jobsForm.get('contactViaList') as FormArray
    // console.log(cformContact)
    // console.log(contactViaArray)

    // let cformContact=this.jobsForm.get('contactViaList') as FormArray
    // console.log(cformContact)
    // this.contactViaList=cformContact
    // for (let contactVia of this.contactViaList.controls) {
    //   console.log(contactVia)
    // }

    let self=this
    this.dbRef.child('uploadThumbs/').on("child_added", function(snapshot, prevChildKey) {
      var newchildthumb = snapshot.val();
      console.log("-----CHILD ADDED----")
      console.log(newchildthumb);
      // console.log(self.currentUpload.name);
      if(typeof self.currentUpload !== 'undefined'){
        firebase.storage().ref().child('/thumbs/64/'+self.currentUpload.name+'_thumb.png').getDownloadURL().then(function(url) {
          console.log("URL==="+url);
          self.currentUpload.thumb=url;
          self.existingUpload='';
        }).catch(function(error) {
          // Handle any errors here
        });
      }
      
    });

  }

  getData(){
    console.log("===getData===")
    let self=this;
    console.log(this.navParams.get('id'))
    firebase.database().ref('jobs/'+this.navParams.get('id')).on('value', itemSnapshot => {
      let ival=itemSnapshot.val();
      if(ival==null)
      {
        return false;
      }
      if(typeof ival.image !== 'undefined'){
        firebase.database().ref('uploads/'+ival.image).once('value').then( function(mediaSnap) {
          self.existingUpload=mediaSnap.val().url
          console.log("image==="+self.existingUpload)
        });
      }
      firebase.database().ref('job_details/'+ival.job_details_id).on('value', itemSnapshot1 => {
        itemSnapshot1.forEach( itemSnap1 => {
          console.log(itemSnap1.key);
          console.log(itemSnap1.val());
          if(itemSnap1.key!='industry')
          {
            this.inputsArray[itemSnap1.key]=itemSnap1.val();
          }
          if(itemSnap1.key=='industry')
          {
            this.inputsArray[itemSnap1.key]=itemSnap1.val();
            this.populateSubIndustry(itemSnap1.val());
          }
          return false;
        });
      });
      firebase.database().ref('job_employee_benefits/'+ival.job_emp_benefits_id).on('value', itemSnapshot2 => {
        itemSnapshot2.forEach( itemSnap2 => {
          if(itemSnap2.key!='employee_benefits')
          {
            this.inputsArray[itemSnap2.key]=itemSnap2.val();
          }
          if(itemSnap2.key=='employee_benefits')
          {
            let emp_beneArr=itemSnap2.val();
            for (let emp_bene in emp_beneArr) {
              this.employeeBenefitsArray[emp_bene].checkbox=true;
              this.employeeBenefitsArray[emp_bene].details=emp_beneArr[emp_bene];
            }
          }
          return false;
        });
      });
      firebase.database().ref('jobs_contact_workplace/'+ival.jobs_contact_workplace_id).on('value', itemSnapshot3 => {
        itemSnapshot3.forEach( itemSnap3 => {
          let i3val=itemSnap3.val();
          if(itemSnap3.key!='contact_via')
          {
            this.inputsArray[itemSnap3.key]=i3val;
          }
          if(itemSnap3.key=='contact_via')
          {
            this.selectedContactViaArray=[];
            for (let contact in this.contactVias) {
              this.contactVias[contact].checked=false;
            }
            for (let val in i3val) {
              this.selectedContactViaArray.push(i3val[val]);
              for (let contact in this.contactVias) {
                if(this.contactVias[contact].key==i3val[val])
                {
                  this.contactVias[contact].checked=true;

                }
              }
            }
          }
          return false;
        });
      });
      firebase.database().ref('job_work_schedule/'+ival.job_work_schedule_id).on('value', itemSnapshot4 => {
        itemSnapshot4.forEach( itemSnap4 => {
          let timeArrayFetch=itemSnap4.val();
          for (let tkey in timeArrayFetch) {
            if(tkey!='shift_end')
            {
              this.timeArray[itemSnap4.key][tkey]=timeArrayFetch[tkey];
            }
            else
            {
              if(timeArrayFetch[tkey]=='')
              {
                this.timeArray[itemSnap4.key][tkey]=itemSnap4.key;
                this.inputsArray['night_shift']=false;
              }
              else
              {
                this.timeArray[itemSnap4.key][tkey]=timeArrayFetch[tkey];
                this.inputsArray['night_shift']=true;
              }
            }
          }
          return false;
        });
      });
      firebase.database().ref('job_questions/'+ival.job_questions_id).on('value', itemSnapshot5 => {
        itemSnapshot5.forEach( itemSnap5 => {
          let quesArr=itemSnap5.val();
          if(quesArr!='NA')
          {
            if(itemSnap5.key=='0')
            {
              this.questionsArray=[];
            }
            this.inputsArray.question="yes";
            this.questionsArray.push({question_name:quesArr.question_name,option_type:quesArr.option_type,options:[]});
            for (let options in quesArr.options) {
              this.questionsArray[this.questionsArray.length-1].options.push({val:quesArr.options[options]});
            }
          }
          return false;
        });
      });
    });
  }

  clearField(key){
    this.employeeBenefitsArray[key].details='';
  }

  clearTime(key){
    this.timeArray[key].start_time='';
    this.timeArray[key].end_time='';
    this.timeArray[key].shift_end=key;
  }

  resetField(){
    for (let day in this.timeArray){
      this.timeArray[day].shift_end=day;
    }
  }

  checkDates(){
    for (let date in this.timeArray){
      if(this.timeArray[date].holiday==false && (this.timeArray[date].start_time=='' || this.timeArray[date].end_time=='')){
        return false;
      }
    }
    return true;
  }

  checkQuestions(){
    if(this.inputsArray.question=='yes')
    for (let question in this.questionsArray){
      if(this.questionsArray[question].question_name==""){
        return false;
      }
      for (let options in this.questionsArray[question].options){
        if(this.questionsArray[question].options[options].val==""){
          return false;
        }
      }
    }
    return true;
  }

  questionToggle(){
    this.questionsArray=[{question_name:"",option_type:"radio",options:[{val:""}]}];
  }

  addOption(indq){
    this.questionsArray[indq].options.push({val:""});
  }

  addQuestion(){
    this.questionsArray.push({question_name:"",option_type:"radio",options:[{val:""}]});
  }

  removeOption(indq,inda){
    this.questionsArray[indq].options.splice(inda, 1);
  }

  removeQuestion(indq){
    this.questionsArray.splice(indq, 1);
  }

  submitJob(form){
    if(!form.valid || this.checkDates()==false || this.checkQuestions()==false){
      this.validateAllFormFields(form);
      console.log(form.value);
    }
    else{
      console.log(form.value);
      this.saveJobDetails(form)
    }
  }

  saveJob(form){
    if(this.checkQuestions()==false){
      return false;
    }

    if(!form.controls.application_sent_mail.valid){
      return false;
    }

    if(!form.controls.designation.valid){
      return false;
    }

    if(form.value.mobile!='' && !form.controls.mobile.valid){
      return false;
    }

    if(form.value.salary_amount!='' && !form.controls.salary_amount.valid){
      return false;
    }

    console.log(form.value);
    this.saveJobDetails(form)
  }

  saveJobDetails(form){
    let application_sent_mail=form.value.application_sent_mail
    let workplace=form.value.workplace
    let workplace_name=form.value.workplace_name
    let workplace_address=form.value.workplace_address
    let workplace_latitude=form.value.workplace_latitude
    let workplace_longitude=form.value.workplace_longitude
    let mobile=form.value.mobile
    let designation=form.value.designation
    let type=form.value.type
    let salary_amount=form.value.salary_amount
    let salary_unit=form.value.salary_unit
    let employment_type=form.value.employment_type
    let industry=form.value.industry
    let sub_industry=form.value.sub_industry
    let contact_via=this.selectedContactViaArray
    let additional_info=form.value.additional_info
    let employee_benefits: Array<any> = [];
    for (let emp_bene in this.employeeBenefitsArray) {
      if(this.employeeBenefitsArray[emp_bene].checkbox==true)
      {
        employee_benefits[emp_bene]=this.employeeBenefitsArray[emp_bene].details;
      }
    }
    let weekArr=this.timeArray;
    if(this.inputsArray.night_shift==false)
    {
      for (let day in weekArr) {
        weekArr[day].shift_end='';
      }
    }
    let job_questions: Array<any> = [];
    for (let question in this.questionsArray) {
      job_questions.push({question_name:this.questionsArray[question].question_name,option_type:this.questionsArray[question].option_type,options:[]});
      for (let options in this.questionsArray[question].options) {
        job_questions[job_questions.length-1].options.push(this.questionsArray[question].options[options].val);
      }
    }

        
    if(this.navParams.get('action')=="edit")
    {
      firebase.database().ref('jobs/'+this.navParams.get('id')).on('value', itemSnapshot => {
        let idArr=itemSnapshot.val();
        console.log("id==")
        console.log(idArr)

        if(typeof this.currentUpload !== 'undefined'){
          firebase.database().ref('jobs/'+this.navParams.get('id')+'/image').set(this.currentUpload.fileId);
        }
        for (let itemSnap in idArr) {
          if(itemSnap=='job_details_id')
          {
            firebase.database().ref('job_details/'+idArr[itemSnap]+'/designation').set(designation);
            firebase.database().ref('job_details/'+idArr[itemSnap]+'/employment_type').set(employment_type);
            firebase.database().ref('job_details/'+idArr[itemSnap]+'/industry').set(industry);
            firebase.database().ref('job_details/'+idArr[itemSnap]+'/sub_industry').set(sub_industry);
            firebase.database().ref('job_details/'+idArr[itemSnap]+'/salary_amount').set(salary_amount);
            firebase.database().ref('job_details/'+idArr[itemSnap]+'/salary_unit').set(salary_unit);
            firebase.database().ref('job_details/'+idArr[itemSnap]+'/type').set(type);
          }
          if(itemSnap=='job_emp_benefits_id')
          {
            firebase.database().ref('job_employee_benefits/'+idArr[itemSnap]+'/additional_info').set(additional_info);
            firebase.database().ref('job_employee_benefits/'+idArr[itemSnap]+'/employee_benefits').set(employee_benefits);
          }
          if(itemSnap=='jobs_contact_workplace_id')
          {
            firebase.database().ref('jobs_contact_workplace/'+idArr[itemSnap]+'/application_sent_mail').set(application_sent_mail);
            firebase.database().ref('jobs_contact_workplace/'+idArr[itemSnap]+'/contact_via').set(contact_via);
            firebase.database().ref('jobs_contact_workplace/'+idArr[itemSnap]+'/mobile').set(mobile);
            firebase.database().ref('jobs_contact_workplace/'+idArr[itemSnap]+'/workplace').set(workplace);
            firebase.database().ref('jobs_contact_workplace/'+idArr[itemSnap]+'/workplace_address').set(workplace_address);
            firebase.database().ref('jobs_contact_workplace/'+idArr[itemSnap]+'/workplace_name').set(workplace_name);
            firebase.database().ref('jobs_contact_workplace/'+idArr[itemSnap]+'/workplace_latitude').set(workplace_latitude);
            firebase.database().ref('jobs_contact_workplace/'+idArr[itemSnap]+'/workplace_longitude').set(workplace_longitude);
          }
          if(itemSnap=='job_work_schedule_id')
          {
            firebase.database().ref('job_work_schedule/'+idArr[itemSnap]).set(weekArr);
          }
          if(itemSnap=='job_questions_id')
          {
            if(this.inputsArray.question=='no'){
              firebase.database().ref('job_questions/'+idArr[itemSnap]).set({0:"NA"});
            }
            else{
              firebase.database().ref('job_questions/'+idArr[itemSnap]).set(job_questions);
            }
          }
        }
        this.commonfunc.presentToast("Job Updated Successfully!!!");
        //form.reset();
      });
    }
    else
    {
      let jobs_contact_workplace_ref=this.af.list('jobs_contact_workplace').push({ application_sent_mail,workplace,workplace_name,workplace_address,workplace_latitude,workplace_longitude,mobile,contact_via})
      let job_details_ref=this.af.list('job_details').push({ designation,type,employment_type,salary_amount,salary_unit,industry,sub_industry})
      let job_emp_benefits_ref=this.af.list('job_employee_benefits').push({employee_benefits,additional_info})
      let job_work_schedule_ref=this.af.list('job_work_schedule').push(weekArr)
      let job_questions_ref:any;
      if(this.inputsArray.question=='no'){
        job_questions_ref=this.af.list('job_questions').push({0:"NA"})
      }
      else{
        job_questions_ref=this.af.list('job_questions').push(job_questions)
      }

      let jobs_contact_workplace_id=jobs_contact_workplace_ref.key
      let job_details_id=job_details_ref.key
      let job_emp_benefits_id=job_emp_benefits_ref.key
      let job_work_schedule_id=job_work_schedule_ref.key
      let job_questions_id=job_questions_ref.key
      let job_status='draft'
      this.af.list('jobs').push({jobs_contact_workplace_id,job_details_id,job_emp_benefits_id,job_work_schedule_id,job_questions_id,job_status})
      this.commonfunc.presentToast("Job added Successfully!!!");
      //form.reset();
    }

  }

  // get contactViaList(): FormArray {
  //   return this.jobsForm.get('contactViaList') as FormArray;
  // };


  populateSubIndustry(industry){
    this.subindustries=[]
    let industrySubindustryRef: firebase.database.Reference = firebase.database().ref('industry_subindustry/'+industry);
    industrySubindustryRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.subindustries.push({"key":ikey,"value":ival})
        return false;
      });
      console.log("subindustry=====")
      console.log(this.subindustries)
    });
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  updateContactViaList(key, isChecked, index) {
    console.log("ischecked=="+isChecked)
   if(isChecked) {
    this.selectedContactViaArray.push(key)
   } else {
    const index: number = this.selectedContactViaArray.indexOf(key);
    if (index !== -1) {
        this.selectedContactViaArray.splice(index, 1);
    }   
   }
   console.log(this.selectedContactViaArray)
 }

 selectImage()
 {
    this._IMG.selectImage()
    .then((data) =>
    {
       this.jobImage = data;
       console.log( this.jobImage)
    });
 }

 detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file);
    let self=this;
    this._IMG.pushUpload(this.currentUpload).then((snapshot : any) =>
    {
      //  firebase.storage().ref().child('/thumbs/64/'+self.currentUpload.name+'_thumb.png').getDownloadURL().then(function(url) {
      //   console.log("URL==="+url);
      //   self.currentUpload.thumb=url;
      //   self.existingUpload='';
      // }).catch(function(error) {
      //   // Handle any errors here
      // });
       
    });
    
  }

}
