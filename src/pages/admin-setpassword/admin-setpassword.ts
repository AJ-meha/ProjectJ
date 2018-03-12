import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

import { AdminLoginPage } from '../admin-login/admin-login';

import firebase from 'firebase/app';
import {Md5} from 'ts-md5/dist/md5';

/**
 * Generated class for the AdminSetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'setpassword',
  segment:'admin/setpassword/:email/:uid'
})
@Component({
  selector: 'page-admin-setpassword',
  templateUrl: 'admin-setpassword.html',
})
export class AdminSetpasswordPage {

  public usercheck: firebase.database.Reference = firebase.database().ref('users');

  emailid:any;
  uid:any;
  loading:Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData:AuthProvider, public alertCtrl:AlertController, public loadingCtrl:LoadingController) {

  	this.emailid = navParams.data['email'];
  	this.uid = navParams.data['uid'];

  	this.connectfirebase();
  }

  connectfirebase(){
      this.authData.loginUser("viraj@ajency.in","qwertyuiop").then(authData=>{
      let x=0;
        this.usercheck.on('value', itemSnapshot => {
          try {
            itemSnapshot.forEach( itemSnap => {
              let ival=itemSnap.val()
              if(ival.email==this.emailid && ival.uid==this.uid)
              {
                this.loading.dismiss();
                x=1;
                console.log("true");
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminSetpasswordPage');
  }

}
