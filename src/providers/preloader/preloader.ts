import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the PreloaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PreloaderProvider {
  private loading : any;
  constructor(public http: HttpClient,public loadingCtrl : LoadingController) {
    console.log('Hello PreloaderProvider Provider');
  }

  displayPreloader() : void
  {
     this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
     });

     this.loading.present();
  }



  hidePreloader() : void
  {
     this.loading.dismiss();
  }

}
