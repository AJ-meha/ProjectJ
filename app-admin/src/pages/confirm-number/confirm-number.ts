import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/global-vars/global-vars';
import { Http,Headers } from '@angular/http';

/**
 * Generated class for the ConfirmNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-confirm-number',
  templateUrl: 'confirm-number.html',
})
export class ConfirmNumberPage {

  code:any;
  number:any;
  mobile_code = GlobalVarsProvider.mobile_code;
  userType = "";
  userId = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,private http:Http) {
    for(let code in this.mobile_code)
    {
      if(this.mobile_code[code].key == this.navParams.get('code'))
      {
        this.code=this.mobile_code[code].value;
      }
    }
    this.number=this.navParams.get('number');

    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Accept' , 'application/json');
    headers.append('Content-Type' , 'application/json');
    let self=this;
    this.http.get(' https://us-central1-project-j-main.cloudfunctions.net/usercheck?code='+self.navParams.get('code')+'&number='+self.number+'',{ headers: headers })
      .subscribe((data) => {
        console.log(data.json());
        let userJson = data.json();
        if(userJson.exists === true){
          self.userType = userJson.type;
          self.userId = userJson.id;
        }
        else{
          self.userType = "NA";
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmNumberPage');
  }

  dismiss() {
     this.viewCtrl.dismiss({"action":"cancel"});
  }

  confirm() {
     this.viewCtrl.dismiss({"action":"confirm","type":this.userType});
  }

}
