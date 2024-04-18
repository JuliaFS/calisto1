import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile, createUserWithEmailAndPassword } from "firebase/auth";

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
  //private registration$: Observable<User> = new Observable();
 // isLoggedIn : boolean = false;
 //private isAuthenticated: boolean = false;
 //private auth = getAuth();
 

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
// get isLogged(): boolean{
//   let isLoggedInUser = this.authStatusListener();
//   if(isLoggedInUser === null){
//     return false;
//   } else {
//     return true;
//   }
// }


  //............authStatus
  // get isLogged(): boolean{
  //   let isLoggedInUser = false;
  //   const user = this.afAuth.authState.pipe(
  //     switchMap(user => {
  //       if(user === null){
  //         console.log('hei from is user')
  //         isLoggedInUser = false;
  //       } else {
  //         console.log('hei from else user')
  //         isLoggedInUser = true;
  //       }
  //     })
  //   );
  //   console.log(isLoggedInUser);
  //   return isLoggedInUser;
  // }

  // getUid() {
  //   let uid = null;
  //   this.afAuth.authState.pipe(
  //     tap(user => console.log(user?.uid)),
  //     tap(user => console.log(user?.displayName))
  //   );
  //   return uid;
  // }
  // getDisplayName() {
  //   const user = this.afAuth.currentUser.then(res => {
  //     if(res !== null){
  //       return res.displayName;
  //     } else {
  //       return null;
  //     }
  //   })

  // }

  // userUid(){
  //     const user = this.afAuth.currentUser;

  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/auth.user
  //       // ...
  //       //console.log(user.uid);
  //       return user.uid;
  //     } else {
  //         return "No such user!";
  //       // No user is signed in.
  //     }
  //    }



getAuthState() {
  return this.afAuth.authState;
}

// async userDisplayName() {
//     let userInfo = null;
//     return userInfo;
//    }

register(email: string, displayName: string, password: string): Observable<any>{
  return from(this.afAuth.createUserWithEmailAndPassword(email, password)
  .then(response => {
      //   //this.isAuthenticated = true;
         response.user?.updateProfile({displayName: displayName});
       })
  );
}

   

// register( email: string, password: string): Observable<any>{
//   //const promise = 
//   return from(this.afAuth.createUserWithEmailAndPassword(email, password));
//   // .then(response => {
//   //   //this.isAuthenticated = true;
//   //   response.user?.updateProfile({displayName: username});
//   // }))
//   //return from(promise);
// }

// private async UpdateProfile(displayName: string) {
//   const profile = {
//       displayName: displayName
//   }
//   return (await this.afAuth.currentUser).updateProfile(profile);
// }

//working with private auth = getAuth();
// register(username: string, email: string, password: string): Observable<any>{
//   const promise = createUserWithEmailAndPassword(this.auth, email, password)
//   .then(response => {
//     this.isAuthenticated = true;
//     updateProfile(response.user, { displayName: username});
// });
  
//   return from(promise);
// }


  
  


  // register(displayName: string, email: string, password: string){
  //   return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
  //     //tap(user => localStorage.setItem(user.uid))),
  //     catchError((error: FirebaseError) => 
  //       throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
  //     )
  //   );
  // }

  logout(): Observable<any> {
   // this.isAuthenticated = false;
    return from(this.afAuth.signOut());
  }

  // private translateFirebaseErrorMessage({code, message}: FirebaseError) {
  //   if (code === "auth/user-not-found") {
  //     return "User not found.";
  //   }
  //   if (code === "auth/invalid-email") {
  //     return "User not found.";
  //   }
  //   return message;
  // }
}
