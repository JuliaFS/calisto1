import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile, createUserWithEmailAndPassword, GoogleAuthProvider } from "firebase/auth";

import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

//import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { FirebaseError } from 'firebase/app';

import { BehaviorSubject, Observable, catchError, from, map, switchMap, tap, throwError } from 'rxjs';
import { User } from '../shared/types/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( 
    private afAuth: AngularFireAuth,
    private router: Router, 
    //private location: Location
  ) { 
    this.authStatusListener(); 
  }

  currentUser : any = null;
  private authStatusSub = new BehaviorSubject(this.currentUser);
  currentAuthStatus$ = this.authStatusSub.asObservable();

authStatusListener(){
  this.afAuth.onAuthStateChanged((credential)=>{
    if(credential){
      this.authStatusSub.next(credential);
      //console.log('User is logged in');
    }
    else{
      this.authStatusSub.next(null);
      //console.log('User is logged out');
    }
  })
}

  getUserDisplayName(){
        const auth = getAuth();
        const user = auth.currentUser;
  
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          // ...
          //console.log(user.uid);
          return user.displayName;
        } else {
            return null;
          // No user is signed in.
        }
       
  }

register(email: string, displayName: string, password: string): Observable<any>{
  return from(this.afAuth.createUserWithEmailAndPassword(email, password)
  .then(response => {
      //   //this.isAuthenticated = true;
         response.user?.updateProfile({displayName: displayName});
       })
  );
}

login(email: string, password: string): Observable<any>{
  return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
    catchError((error: FirebaseError) => 
      throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
    )
  );
}

  // //sign in with google
  googleSignIn(){
      return this.afAuth.signInWithPopup(new GoogleAuthProvider).then((res) => {
        this.router.navigate(['/home']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      }, err => {
        alert(err.message);
      })
     }

  logout(): Observable<any> {
   // this.isAuthenticated = false;
    return from(this.afAuth.signOut());
  }

  private translateFirebaseErrorMessage({code, message}: FirebaseError) {
    if (code === "auth/user-not-found") {
      return "User not found.";
    }
    if (code === "auth/invalid-email") {
      return "User not found.";
    }
    return message;
  }
}
