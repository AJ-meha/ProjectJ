import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { AdminDashboardPage } from '../admin-dashboard/admin-dashboard';

import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

/**
 * Generated class for the AdminLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'login',
  segment:'admin/login'
})
@Component({
  selector: 'page-admin-login',
  templateUrl: 'admin-login.html',
})
export class AdminLoginPage {
  loginForm:FormGroup;
  loading:Loading;
  email:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public authData:AuthProvider,public formBuilder:FormBuilder,public alertCtrl:AlertController,public loadingCtrl:LoadingController,private http: Http) {

    this.connectfirebase();

    this.loginForm=formBuilder.group({
      email:['',Validators.compose([Validators.required,EmailValidator.isValid])],
      password:['',Validators.compose([Validators.required,Validators.minLength(6)])]
    });
  }

  connectfirebase(){
      this.authData.loginUser("viraj@ajency.in","qwertyuiop").then(authData=>{
        this.loading.dismiss();
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

  loginUser(){
    let self=this;
    if(!this.loginForm.valid){
      console.log(this.loginForm.value);
    }
    else{

      this.loading=this.loadingCtrl.create({
        dismissOnPageChange:true
      });
      this.loading.present();

      let x=this.authData.loginAdmin(this.loginForm.value.email,this.loginForm.value.password);
      if(x.code==1)
      {
        this.loading.dismiss();
        self.email=x.msg.email;
        this.authData.loginWithEmail(x.msg);
        this.navCtrl.setRoot(AdminDashboardPage);
      }
      else
      {
        this.loading.dismiss().then(()=>{
          let alert=this.alertCtrl.create({
            message:x.msg,
            buttons:[{
              text:"Ok",
              role:'cancel'
            }
            ]
          });
          alert.present();
        });
      }
    }
  }

  sendEmail() {

    let url = `https://us-central1-project-j-2018.cloudfunctions.net/httpEmail`
    let params: URLSearchParams = new URLSearchParams();
    let headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

    params.set('to', 'tanvi.s@ajency.in');
    params.set('from', 'viraj@ajency.in');
    params.set('subject', 'test-email');
    params.set('content', 'Hello World');

    return this.http.post(url, params)
                    .toPromise()
                    .then( res => {
                      console.log(res)
                    })
                    .catch(err => {
                      console.log(err)
                    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminLoginPage');
  }

}
