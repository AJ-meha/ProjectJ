import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

import { AdminLoginPage } from '../admin-login/admin-login';

import firebase from 'firebase/app';
import {Md5} from 'ts-md5/dist/md5';

import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

import { CommonFunctionsProvider } from '../../providers/common-functions/common-functions';

/**
 * Generated class for the AdminSetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'setpassword',
  segment:'setpassword/:email/:uid'
})
@Component({
  selector: 'page-admin-setpassword',
  templateUrl: 'admin-setpassword.html',
})
export class AdminSetpasswordPage {

  resetForm:FormGroup;

  public usercheck: firebase.database.Reference = firebase.database().ref('admin_user');

  emailid:any;
  uid:any;
  key:any;
  loading:Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData:AuthProvider, public alertCtrl:AlertController, public loadingCtrl:LoadingController, public formBuilder:FormBuilder, public commonfunc:CommonFunctionsProvider) {

  	this.emailid = navParams.data['email'];
  	this.uid = navParams.data['uid'];

  	this.connectfirebase();

    this.resetForm=this.formBuilder.group({
      password:['',Validators.compose([Validators.required,Validators.minLength(6)])]
    });

  }

  connectfirebase(){
      this.authData.loginUser("jobsproject2018@gmail.com","Jobsproject2018!@#").then(authData=>{
      let x=0;
        this.usercheck.on('value', itemSnapshot => {
          try {
            itemSnapshot.forEach( itemSnap => {
              let ikey=itemSnap.key
              let ival=itemSnap.val()
              if(ival.email==this.emailid && ival.uid==this.uid)
              {
                this.loading.dismiss();
                x=1;
                this.key = ikey;
                throw 1;
              }

              if(ival.email==this.emailid && ival.uid!=this.uid)
              {
                this.loading.dismiss().then(()=>{
                  let alert=this.alertCtrl.create({
                    message:"Incorrect UID",
                    buttons:[{
                      text:"Ok",
                      role:'cancel'
                    }
                    ]
                  });
                  alert.present();
                });
                x=1;
                this.navCtrl.setRoot(AdminLoginPage);
                throw 1;
              }

              return false;
            });
          } catch (e) {
            if (e !== 1) throw e;
          }

          if(x==0)
          {
            this.loading.dismiss().then(()=>{
              let alert=this.alertCtrl.create({
                message:"Incorrect Email",
                buttons:[{
                  text:"Ok",
                  role:'cancel'
                }
                ]
              });
              alert.present();
            });
            this.navCtrl.setRoot(AdminLoginPage);
          }
         
        });
        console.log(authData);
      },error=>{
        this.loading.dismiss().then(()=>{
          let alert=this.alertCtrl.create({
            message:error.message,
            buttons:[{
              text:"Ok",
              role:'cancel'
            }
              
            ]
          });
          alert.present();
        });
      });
      this.loading=this.loadingCtrl.create({
        dismissOnPageChange:true
      });
      this.loading.present();
  }

  resetpassword() {
    if(!this.resetForm.valid){
      console.log(this.resetForm.value);
    }
    else{
      let passwordhash = Md5.hashStr(this.resetForm.value.password)
      firebase.database().ref('admin_user/'+this.key+'/password').set(passwordhash);
      this.commonfunc.presentToast("Password Set Successfully!!!");
      this.resetForm.reset();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminSetpasswordPage');
  }

}
