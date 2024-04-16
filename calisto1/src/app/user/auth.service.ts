import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';

//import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { FirebaseError } from 'firebase/app';

import { Observable, catchError, from, tap, throwError } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( 
    private afAuth: AngularFireAuth,
    private router: Router, 
    //private location: Location
  ) { }

      get isLogged(): boolean {
        //const user = this.afAuth.currentUser;
        //console.log('user: ')
        //console.log(user)
        // const isLoggedIn = !!user;
        // //console.log('isloggedin: ' + isLoggedIn)
        // return isLoggedIn;
        return true;
    
    }


  register(email: string, password: string){
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      tap(user => console.log(user)),
      catchError((error: FirebaseError) => 
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  logout(){ //logout(): Observable<any> {
    //return from(this.afAuth.signOut());
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
