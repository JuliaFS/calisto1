import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserProfile } from 'firebase/auth';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ProfileUser } from 'src/app/shared/types/userProfile';
import { NgForm } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/compat/storage';

//import { ImageUploadService } from '../image-upload.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, finalize } from "rxjs/operators";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    // trigger('openClose', [
    //   // ...
    //   state('open', style({
    //     height: '200px',
    //     opacity: 1,
    //     backgroundColor: 'yellow'
    //   })),
    //   state('closed', style({
    //     height: '100px',
    //     opacity: 0.8,
    //     backgroundColor: 'blue'
    //   })),
    //   transition('open => closed', [
    //     animate('1s')
    //   ]),
    //   transition('closed => open', [
    //     animate('0.5s')
    //   ]),
    // ]),
    //---
    // trigger('profile', [
    //   state('true', style({ opacity: 1 })),
    //   state('false', style({ opacity: 0 })),
    //   //transition('false => true', animate('0.5s ease-in')),
    //   transition('true => false', animate('0.5 ease-out'))
    //])

    //  // ----
    // trigger('profile', [
    //   state('true', style({
    //     transform: 'translateX(-100%)'
    //   })),
    //   transition('void <=> *', animate('0.5s ease-in')),
    
    //   state('false', style({
    //     transform: 'translateX(-100%)'
    //   })),
    //   transition('void <=> *', animate('0.5s ease-out'))]),
    //   //.......

    trigger('profile', [
      state('void', style({
        transform: 'translateX(-100%)'
      })),
      transition('void <=> *', animate('0.5s ease-in'))
    ]),
    trigger('profileContainer', [
      state('void', style({
        transform: 'translateX(100%)'
      })),
      transition('void <=> *', animate('0.4s ease-out'))
    ]),
  ],
})
export class ProfileComponent implements OnInit {

  uid : string = '';
  email: string = '';
  url : string = '';
  isOpen : boolean = true;
  serverMessage : string = '';

  userInfo: ProfileUser = {
    uid: this.uid,
    displayName: '-',
    firstName: '-',
    lastName: '-',
    phone: '-',
    address: '-',
    photoURL: '-',
  }; 


  // profileObj : ProfileUser = {
  //   uid: this.uid,
  //   displayName: '-',
  //   firstName: '-',
  //   lastName: '-',
  //   phone: '-',
  //   address: '-',
  //   photoURL: '-',
  // };
  //currentUserUid: string = '';

 // user$ = this.auth.currentUser$!;


  constructor(
    //private imageUploadService: ImageUploadService,
    //private toast: HotToastService,
   // private usersService: UsersService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    //private imageUploadService: ImageUploadService,
  ) {}

      //this.auth.currentAuthStatus$.subscribe(user => console.log('user: ' + user));
    // this.auth.currentAuthStatus$.subscribe(user => {
    //   this.uid = user?.uid;
    //   this.email = user?.email;
    // });


  ngOnInit(): void {
    this.auth.currentAuthStatus$.subscribe({
      next: user => {
         //---
         if(user !== null){

          this.uid = user.uid;
          this.email = user.email;

         this.auth.getProfile(this.uid).subscribe({
           next: (profile) => {
            //console.log('profile from getProfile: ' + profile);
             if(profile === undefined){
              //console.log('user from !profile as undefined')
              this.auth.createProfile(this.uid, this.userInfo).subscribe({
                next: () => {
                  //this.userInfo = this.profileObj;
                  //this.isOpen = true 
                 // console.log('yesss')
                },
                error: (err) => this.serverMessage = err.message
              })
            } else {
              //console.log('userInfo from profile exist: ' + this.userInfo)
              this.userInfo = profile as ProfileUser;
            }
           },
         error: (err) => this.serverMessage = err.message
         })
      } 
      // else {
      //   this.serverMessage = "You have to login/registered first...";
      // }
    },
      error: (err) => this.serverMessage = err.message
    })
  }


  async upload(event: any){
    const file = event.target.files[0];
    console.log('file: ' + file);
    if(file){
      const path = `yt/${file.name}`;
      const uploadTask =await this.storage.upload(path, file);
      await uploadTask.ref.getDownloadURL().then((url) => {
        this.url = url;
      });
      //this.profileObj.photoURL = this.url;
      this.userInfo.photoURL = this.url;
      //console.log('this.url in upload function: ' + this.url)
    }
  }

  saveProfilePicture(){
   // console.log('profileObj: ' + this.profileObj.photoURL)
    //setDoc(cityRef, { capital: true }, { merge: true });
    //     const washingtonRef = doc(db, "cities", "DC");

    // // Set the "capital" field of the city 'DC'
    // await updateDoc(washingtonRef, 
    //   capital: true
    // });
    //console.log('this.url: ' + this.url)
    // if(this.url === ''){
    //   this.serverMessage = 'Pls, attach picture!';
    //   return;
    // }
    //console.log(this.userInfo.photoURL)
    this.auth.updateProfilePicture(this.uid, this.userInfo)
    .subscribe({
      next: () => {
        this.isOpen = true;
      },
      error: (err) => this.serverMessage = err.message
    });
  
   }

   editProfile(){
     this.isOpen = false;
   }

   saveProfile(form: NgForm){
  //   //this.isOpen = !this.isOpen;

  //   // if (form.invalid) {
  //   //   return;
  //   // }

  //   // if (form.invalid) {
  //   //   this.serverMessage = 'Pls fill all fields corectly!';
  //   //   return;
  //   // }

     const { displayName, firstName, lastName, phone, address } = form.value;
  //   //console.log('dispayName: ' + displayName)
     this.userInfo.uid = this.uid;
  //   //console.log('display uid: ' + this.profileObj.uid)
  //   //console.log('display name: ' + this.profileObj.displayName)
     this.userInfo.displayName = displayName;
    this.userInfo.firstName = firstName;
     this.userInfo.lastName = lastName;
     this.userInfo.phone = phone;
     this.userInfo.address = address;

  //   //this.companyObj.owner = this.ownerVar;
  //   //console.log('this.profileObj.uid: ' + this.profileObj.uid);
  //console.log(this.uid);
  //console.log(this.userInfo.displayName);
     this.auth.updateProfileDocument(this.uid, this.userInfo)
     .subscribe({
       next: () => {
        //console.log('inside updateProfileDocument');
        this.isOpen = true;
       },
       error: (err) => this.serverMessage = err.message
     })
  }


  backToProfile(){
    // this.auth.getUserProfile(this.uid).subscribe({
    //   next: (user) => {
    //     this.userInfo = user;
    //     this.isOpen = true;
    //   },
    //   er
    console.log(this.userInfo.firstName)
    console.log('userInfo-address: ' + this.userInfo.address);
    console.log('pchiuh')
    this.isOpen = true;
  }
}
