import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

/**
 * Generated class for the AdminLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'admin-login',
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
  constructor(public navCtrl: NavController, public navParams: NavParams,public authData:AuthProvider,public formBuilder:FormBuilder,public alertCtrl:AlertController,public loadingCtrl:LoadingController) {

    this.loginForm=formBuilder.group({
      email:['',Validators.compose([Validators.required,EmailValidator.isValid])],
      password:['',Validators.compose([Validators.required,Validators.minLength(6)])]
    });
  }

  loginUser(){
    if(!this.loginForm.valid){
      console.log(this.loginForm.value);
    }
    else{

      this.loading=this.loadingCtrl.create({
        dismissOnPageChange:true
      });
      this.loading.present();

      let self=this;
      let x=this.authData.loginAdmin(this.loginForm.value.email,this.loginForm.value.password);
      if(x.code==1)
      {
        this.loading.dismiss();
        this.email=x.msg.email;
        this.authData.loginWithEmail(x.msg);
        this.authData.getAdminInit().then(admin_init=>{
          self.authData.unsetAdminInit();
          if(admin_init=="init" || admin_init==null)
          {
            self.navCtrl.setRoot("admin-list-jobs");
          }
          else
          {
            window.location.href=admin_init;
          }
        });
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminLoginPage');
  }

}
