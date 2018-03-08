import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the CommonFunctionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommonFunctionsProvider {

  constructor(public toastCtrl:ToastController) {
    console.log('Hello CommonFunctionsProvider Provider');
  }

  public presentToast(message:string):void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
  
    toast.present();
  }

}
