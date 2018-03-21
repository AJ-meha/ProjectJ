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

  public usersRef: firebase.database.Reference = firebase.database().ref();
  
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

  setUserRole(role) {
    this.storage.set('customer_userrole', role);
  }

  getUserRole(){
    return this.storage.get('customer_userrole').then((value)=>{
      return value;
    });
  }

  loginWithEmail(email) {
    this.storage.set(this.CUSTOMER_HAS_LOGGED_IN, true);
    this.setUserEmail(email);
  }

  loginWithPhone(phone) {
    this.storage.set(this.CUSTOMER_HAS_LOGGED_IN, true);
    this.setUserPhone(phone);

    let self=this;
    let role: string;
    this.usersRef.child("users").child(phone).once('value', function(snapshot) {
      let val=snapshot.val();
      if(val == null)
      {
        let userArr={role:"employee"};
        role = "employee";
        self.usersRef.child("users").child(phone).set(userArr);
      }
      else
      {
        role = val.role;
      }
      this.setUserRole(role);
    });
  }

  logoutUpdateStorage() {
    this.storage.remove(this.CUSTOMER_HAS_LOGGED_IN);
    this.storage.remove('customer_useremail');
    this.storage.remove('customer_userphone');
    this.storage.remove('customer_userrole');
  }

}
