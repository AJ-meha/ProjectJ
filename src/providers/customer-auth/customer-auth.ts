import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import firebase from 'firebase/app';
/*
  Generated class for the CustomerAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustomerAuthProvider {
  CUSTOMER_HAS_LOGGED_IN = 'customerHasLoggedIn';
  constructor(public afAuth: AngularFireAuth, public storage: Storage) {
  }

  loginUser(newEmail:string,newPassword:string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(newEmail,newPassword);
  }

  logoutUser(): Promise<void> {
    this.logoutUpdateStorage();
    return this.afAuth.auth.signOut();
  }

  signupUser(newEmail:string,newPassword:string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail,newPassword);
  }

  resetPassword(email:string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  loginFacebook(): Promise<any> {
    // login with facebook code goes here  .....
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  setUserEmail(email) {
    this.storage.set('customer_useremail', email);
  }

  getUserEmail(){
    return this.storage.get('customer_useremail').then((value)=>{
      return value;
    });
  }

  setUserPhone(phone) {
    this.storage.set('customer_userphone', phone);
  }

  getUserPhone(){
    return this.storage.get('customer_userphone').then((value)=>{
      return value;
    });
  }

  loginWithEmail(email) {
    this.storage.set(this.CUSTOMER_HAS_LOGGED_IN, true);
    this.setUserEmail(email);
  }

  loginWithPhone(email) {
    this.storage.set(this.CUSTOMER_HAS_LOGGED_IN, true);
    this.setUserEmail(email);
  }

  logoutUpdateStorage() {
    this.storage.remove(this.CUSTOMER_HAS_LOGGED_IN);
    this.storage.remove('customer_useremail');
    this.storage.remove('customer_userphone');
  }

}
