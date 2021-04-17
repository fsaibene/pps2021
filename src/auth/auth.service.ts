import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { User } from '../classes/user';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  public loggedUser: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {    
    
    this.afAuth.authState.subscribe(user => {
        if (user) {
            this.userData = user;
            localStorage.setItem('user', JSON.stringify(this.userData));
        } else {
            localStorage.setItem('user', "");
        }
        let storagedUser = localStorage.getItem('user');    
        console.log(storagedUser);
    })
  }

  // Sign in with email/password
    public async login(email: string, password: string): Promise<any> {
        return await firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
            this.ngZone.run(() => {
                this.router.navigate(['home']);
            });
            this.setUserData(result.user);
            this.loggedUser.next(email);
        }).catch(error => {
            if(error) {
                error["hasError"] = true;
            }
            return error;
        });
  }

  // Sign up with email/password
  public async signUp(email: string, password: string) {
    try {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
      /* Call the SendVerificaitonMail() function when new user sign
      up and returns promise */
      // this.sendVerificationMail();
      this.setUserData(result.user);
      this.router.navigate(['home']);
      this.loggedUser.next(email);
    } catch (error) {
      window.alert(error.message);
    }
  }

  // Send email verfificaiton when new user sign up
  public async sendVerificationMail() {
    return firebase.auth().currentUser.sendEmailVerification();
  }

  // Reset Forggot password
  public async forgotPassword(passwordResetEmail: any) {
    return firebase.auth().sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    let usr = localStorage.getItem('user');
    if(usr != null) {
      let userObj = JSON.parse(usr);
      return (userObj !== null && userObj.emailVerified !== false) ? true : false;
    }
    return false;
  }

  // Auth logic to run auth providers
  public async authLogin(provider: any) {
    return firebase.auth().signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['home']);
        })
      this.setUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  public setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out 
  public async signOut() {
    return firebase.auth().signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
      this.userData = null;
      this.loggedUser.next("");
    })
  }
}