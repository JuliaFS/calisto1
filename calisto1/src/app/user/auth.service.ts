import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';
import { FirebaseError} from 'firebase/app';


import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

//import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { FirebaseError } from 'firebase/app';

import { BehaviorSubject, Observable, catchError, from, map, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../shared/types/user';
import { ProfileUser } from '../shared/types/userProfile';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( 
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router, 
  ) { 
    this.authStatusListener(); 
    //this.afAuth.authState.subscribe(user => console.log('Auth state:', user?.uid));
  }

  

  //currentUser$ = this.afAuth.authState;
  // getCurrentUser(): Observable<firebase.default.User | null> {
  //   return this.afAuth.authState;
  // }

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

  // getCurrentUser(): Observable<firebase.default.User | null> {
  //   return this.afAuth.authState;
  // }

  getCurrentUserUid(): Observable<string> {
    return this.afAuth.authState.pipe(
      //tap(user => console.log('User:', user?.uid)),
      map(user => user ? user.uid : '')
    );
  }

  // getCurrentUserUidSync(): string {
  //   const user = this.afAuth.authState.pipe(
  //     map(user => user ? user.uid : '')
  //   );
  // }

  getUserEmail(): string | null{
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      return user.email;
    } else {
      return '';
            // No user is signed in.
    }
  }

  getUserUid(): string{
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      console.log('uid from auth servise: ' + user.uid)
      return user.uid;
    } else {
      return '';
            // No user is signed in.
    }
  }

  register(email: string, displayName: string, password: string): Observable<any>{
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
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

         //forgot password
    forgotPassword(email: string): Observable<any> {
      return from(this.afAuth.sendPasswordResetEmail(email))
      .pipe(
        catchError((error: FirebaseError) => 
          throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
        )
      )
    }

    //....................................
    // addCompany(company: Company){
    //   company.id = this.afs.createId();
      
    //   return this.afs.collection('/Companies').add(company);
    // }
    // getCompanyById(id : string){
    //   return this.afs.collection('Companies').doc(id).valueChanges();
    // }
  
    // getOwnerUid(id: any){
    //  return this.afs.collection('Companies').doc(id).snapshotChanges();
    // }
  
    // //get all companies
    // getAllCompanies(){
    //   return this.afs.collection('Companies').snapshotChanges();
      
    // }
  
    // delete(id: string): Promise<void> {
    //   return this.afs.collection('Companies').doc(id).delete();
    // }
  
    //  //update company 2
    //    update(id: string, data: any): Promise<void> {
    //   return this.afs.collection('Companies').doc(id).update(data);
    // }
    //..............................................

  createUserProfileDocument(uid: string, data: ProfileUser): Observable<any> {
      // Set up Firestore document for user
      return from(this.afStore.collection('users').doc(uid).set(data));
    }

    getUserProfile(id: string): Observable<any>{
        return from(this.afStore.collection('users').doc(id).valueChanges());
    }

    //---------
    saveProfile(displayName: string, firstName: string, lastName: string, phone: string, address: string){
      // this.afAuth.currentUser.then( user => {
      //   user?.updateProfile({displayName, firstName, lastName, phone, address})
      // })
    }

    // setUserDocument(uid: string): Observable<any> {
    //   // return this.firestore.collection('users').doc(uid).set(data);
    //   return this.afStore.collection('users').doc(uid).set({displayName: displayName, firstName, lastName, phone, address});
    // }


     // updateProfile(profileData: Partial<UserInfo>): Observable<any> {
  //   const user = this.auth.currentUser;
  //   return of(user).pipe(
  //     concatMap((user) => {
  //       if (!user) throw new Error('Not authenticated');

  //       return updateProfile(user, profileData);
  //     })
  //   );
  // }

  logout(): Observable<any> {
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
