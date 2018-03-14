import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { CommonFunctionsProvider } from '../../providers/common-functions/common-functions';
import firebase  from 'firebase';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { TabsPage } from '../tabs/tabs';

import { EmailValidator } from '../../validators/email';

/**
 * Generated class for the AdminCreateJobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name: 'create',
    segment:'admin/jobs/:action/:id'
  }
)
@Component({
  selector: 'page-admin-create-jobs',
  templateUrl: 'admin-create-jobs.html',
})
export class AdminCreateJobsPage {
  jobsForm:FormGroup;
  contactVias: Array<any> = [];
  workplaceTypes: Array<any> = [];
  empTypes: Array<any> = [];
  types: Array<any> = [];
  salaryUnits: Array<any> = [];
  industries: Array<any> = [];
  subindustries: Array<any> = [];
  contactViaList:FormArray;
  contactViaArray = [];
  selectedContactViaArray = [];
  pages: Array<{title: string, component: any}>;
  public jobContactViaRef: firebase.database.Reference = firebase.database().ref('job_contact_via');
  public workplacetypeViaRef: firebase.database.Reference = firebase.database().ref('workplace_type');
  public emptypeViaRef: firebase.database.Reference = firebase.database().ref('employment_type');
  public typeRef: firebase.database.Reference = firebase.database().ref('type');
  public salaryUnitRef: firebase.database.Reference = firebase.database().ref('salary_unit');
  public industryRef: firebase.database.Reference = firebase.database().ref('industry');
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private af: AngularFireDatabase,public formBuilder:FormBuilder,public commonfunc:CommonFunctionsProvider) {

    // console.log("jobss---")
    
    this.jobsForm=this.formBuilder.group({
      application_sent_mail:['',Validators.compose([Validators.required,EmailValidator.isValid])],
      workplace:['',Validators.compose([Validators.required])],
      workplace_name:['',Validators.compose([Validators.required])],
      workplace_address:['',Validators.compose([Validators.required])],
      workplace_latitude:['',Validators.compose([Validators.required])],
      workplace_longitude:['',Validators.compose([Validators.required])],
      mobile:['',Validators.compose([Validators.required,Validators.pattern('(\\+852[- ]?)?\\d{10}$')])],
      designation:['',Validators.compose([Validators.required])],
      type:['',Validators.compose([Validators.required])],
      salary_amount:['',Validators.compose([Validators.required,Validators.pattern('[1-9]+[0-9]*')])],
      salary_unit:['',Validators.compose([Validators.required])],
      industry:['',Validators.compose([Validators.required])],
      sub_industry:['',Validators.compose([Validators.required])],
      employment_type:['',Validators.compose([Validators.required])],
      contact_via:['',Validators.compose([Validators.required])],
      additional_info:''
      // contactViaList:this.formBuilder.array([])
      // contactViaList:this.formBuilder.array([])

    });

    this.pages = [
      { title: 'Home', component: TabsPage },
      { title: 'Add Job', component: AdminCreateJobsPage }
    ];

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
    this.jobContactViaRef.on('value', itemSnapshot => {
      itemSnapshot.forEach( itemSnap => {

        console.log(itemSnap.key+"=="+itemSnap.val())
        let ikey=itemSnap.key
        let ival=itemSnap.val()
        this.contactVias.push({"key":ikey,"value":ival})
        if(stepCounter == 0){
          this.selectedContactViaArray.push(ikey)
        }
        
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

    // let cformContact=this.jobsForm.get('contactViaList') as FormArray
    // console.log(cformContact)
    // console.log(contactViaArray)

    // let cformContact=this.jobsForm.get('contactViaList') as FormArray
    // console.log(cformContact)
    // this.contactViaList=cformContact
    // for (let contactVia of this.contactViaList.controls) {
    //   console.log(contactVia)
    // }

  }

  submitJob(form){
    if(!form.valid){
      this.validateAllFormFields(form);
      console.log(form.value);
    }
    else{
      console.log(form.value);
      this.saveJobDetails(form)

      
    }
  }

  saveJob(form){
    console.log("application_sent_mail=="+form.value.application_sent_mail+"==="+form.controls.application_sent_mail.valid+"==="+form.controls.application_sent_mail.dirty);
    if(form.value.application_sent_mail!='' && !form.controls.application_sent_mail.valid){
      return false;
    }

    console.log("mobile=="+form.value.mobile+"==="+form.controls.mobile.valid+"==="+form.controls.mobile.dirty);
    if(form.value.mobile!='' && !form.controls.mobile.valid){
      return false;
    }

    console.log("salary_amount=="+form.value.salary_amount+"==="+form.controls.salary_amount.valid+"==="+form.controls.salary_amount.dirty);
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
    let mobile=form.value.mobile
    let designation=form.value.designation
    let type=form.value.type
    let salary_amount=form.value.salary_amount
    let salary_unit=form.value.salary_unit
    let employment_type=form.value.employment_type
    let contact_via=this.selectedContactViaArray
    let additional_info=form.value.additional_info
    let jobs_contact_workplace_ref=this.af.list('jobs_contact_workplace').push({ application_sent_mail,workplace,workplace_name,workplace_address,mobile,contact_via})
    let job_details_ref=this.af.list('job_details').push({ designation,type,employment_type,salary_amount,salary_unit})
    let job_emp_benefits_ref=this.af.list('job_employee_benefits').push({ additional_info})
    console.log("jobs_contact_workplace_id=="+jobs_contact_workplace_ref.key)
    let jobs_contact_workplace_id=jobs_contact_workplace_ref.key
    let job_details_id=job_details_ref.key
    let job_emp_benefits_id=job_emp_benefits_ref.key
    this.af.list('jobs').push({jobs_contact_workplace_id,job_details_id,job_emp_benefits_id})
    this.commonfunc.presentToast("Job added Successfully!!!");
    form.reset();
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

}
