import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';

import { Storage } from '@ionic/storage';

import {Md5} from 'ts-md5/dist/md5';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public passwordcheck: firebase.database.Reference = firebase.database().ref('admin_user');

  HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(public afAuth: AngularFireAuth, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
    this.passwordcheck.on('value', itemSnapshot => { 
    });
  }

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    this.passwordcheck.on('value', itemSnapshot => { 
    });
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  logoutUser(): Promise<void> {

    this.storage.remove('useremail');
    this.storage.remove('username');

    return this.afAuth.auth.signOut();
  }

  loginAdmin(newEmail: string, newPassword: string) {
  let pass:any;
  let z = 0;
  let passwordhash = Md5.hashStr(newPassword)
    this.passwordcheck.on('value', itemSnapshot => { 
      try {
        itemSnapshot.forEach( itemSnap => {
          let ival=itemSnap.val()
          if(ival.email==newEmail && ival.password==passwordhash)
          {
            pass=ival;
            z=1;
            throw 1;
          }

          if(ival.email==newEmail && ival.password!=passwordhash)
          {
            z=2;
            throw 1;
          }

          return false;
        });
      } catch (e) {
        if (e !== 1) throw e;
      }
     
    });

    if(z==0) return {"code":0,msg:"Incorrect Email"};
    if(z==1) return {"code":1,msg:pass};
    if(z==2) return {"code":2,msg:"Incorrect Password"};
  }

  loginWithEmail(data) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUserDetails(data);
  }

  setUserDetails(data) {
    this.storage.set('useremail', data.email);
    this.storage.set('username', data.name);
  }

  getUserEmail(){
    return this.storage.get('useremail').then((value)=>{
      return value;
    });
  }

  getUserName(){
    return this.storage.get('username').then((value)=>{
      return value;
    });
  }

  setAdminInit(init) {
    this.storage.set('admin_init', init);
  }

  getAdminInit(){
    return this.storage.get('admin_init').then((value)=>{
      return value;
    });
  }

  unsetAdminInit() {
    this.storage.remove('admin_init');
  }

}
