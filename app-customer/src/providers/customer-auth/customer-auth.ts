import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import firebase from 'firebase/app';

import { Events } from 'ionic-angular';
/*
  Generated class for the CustomerAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustomerAuthProvider {
  CUSTOMER_HAS_LOGGED_IN = 'customerHasLoggedIn';

  public usersRef: firebase.database.Reference = firebase.database().ref();
  
  constructor(public afAuth: AngularFireAuth, public storage: Storage, public events: Events) {
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

  getUserAuthToken(){
    return this.storage.get('customer_auth_token').then((value)=>{
      return value;
    });
  }

  loginWithEmail(email) {
    this.storage.set(this.CUSTOMER_HAS_LOGGED_IN, true);
    this.setUserEmail(email);
  }

  loginWithPhone(phone) {
    this.storage.set(this.CUSTOMER_HAS_LOGGED_IN, true);
    if(firebase.auth().currentUser !== null){
      firebase.auth().currentUser.getIdToken()
      .then(authToken => {
        this.storage.set('customer_auth_token', authToken);
       })
    }
    // firebase.auth().onIdTokenChanged( user => {
    //     console.log("token changed===")
    //     if (user) {  user.getIdToken().then( (token:string) => {
    //       this.storage.set('customer_auth_token', token);
    //     })
    //   }
    // })
    this.setUserPhone(phone);

    let self=this;
    let role: string;
    this.usersRef.child("users").child(phone).once('value', function(snapshot) {
      let val=snapshot.val();
      if(val == null)
      {
        self.getLanguage().then(customer_lang=>{
          let userArr={role:"employee",language:customer_lang};
          role = "employee";
          self.usersRef.child("users").child(phone).set(userArr);
        });
      }
      else
      {
        role = val.role;
        self.usersRef.child("users").child(phone).child("language").once('value', function(snapshot) {
          let val=snapshot.val();
          if(val == null)
          {
            self.getLanguage().then(customer_lang=>{
              self.setLanguagePref(customer_lang);
            });
          }
          else
          {
            self.setLanguage(val)
            self.events.publish("app:localize",val);
          }
        });
      }
      self.setUserRole(role);
    });
  }

  logoutUpdateStorage() {
    this.storage.remove(this.CUSTOMER_HAS_LOGGED_IN);
    this.storage.remove('customer_useremail');
    this.storage.remove('customer_userphone');
    this.storage.remove('customer_userrole');
  }

  setLanguage(lang) {
    this.storage.set('customer_lang', lang);
  }

  getLanguage(){
    return this.storage.get('customer_lang').then((value)=>{
      return value;
    });
  }

  setLanguagePref(lang) {
    let self=this;
    this.getUserPhone().then(phone=>{
      self.usersRef.child("users").child(phone).child("language").set(lang);
    });
  }

}
