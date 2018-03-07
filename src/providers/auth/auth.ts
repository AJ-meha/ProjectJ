import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';

import { Storage } from '@ionic/storage';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(public afAuth: AngularFireAuth, public storage: Storage) {
    console.log('Hello AuthProvider Provider');
  }

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
  }

  logoutUser(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  loginWithEmail(email) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUserEmail(email);
  }

  setUserEmail(email) {
    this.storage.set('useremail', email);
  }

  getUserEmail(){
    return this.storage.get('useremail').then((value)=>{
      return value;
    });
  }

}
