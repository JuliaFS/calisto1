import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ProfileUser } from 'src/app/shared/types/userProfile';
import { NgForm } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map, tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('profile', [
      state(
        'void',
        style({
          transform: 'translateX(-100%)',
        })
      ),
      transition('void <=> *', animate('0.5s ease-in')),
    ]),
    trigger('profileContainer', [
      state(
        'void',
        style({
          transform: 'translateX(100%)',
        })
      ),
      transition('void <=> *', animate('0.4s ease-out')),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  uid: string = '';
  email: string = '';
  //url: string = '';
  isOpen: boolean = true;
  serverMessage: string = '';
  isLoading: boolean = false;
  isChoosedPicture: boolean = false;

  ref: any;
  task: any;
  uploadProgress: any;
  downloadURL: any;
  uploadState: any;

  userInfo: ProfileUser = {
    uid: this.uid,
    displayName: '-',
    firstName: '-',
    lastName: '-',
    phone: '-',
    address: '-',
    photoURL: '',
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.auth.currentAuthStatus$.subscribe({
      next: (user) => {
        //---
        if (user !== null) {
          this.uid = user.uid;
          this.email = user.email;

          this.auth.getProfile(this.uid).subscribe({
            next: (profile) => {
              console.log('profile: ' + profile)
              if (profile === undefined) {
                this.auth.createProfile(this.uid, this.userInfo).subscribe({
                  next: () => {},
                  error: (err) => (this.serverMessage = err.message),
                });
              } else {
                this.userInfo = profile as ProfileUser;
              }
            },
            error: (err) => (this.serverMessage = err.message),
          });
        }
      },
      error: (err) => (this.serverMessage = err.message),
    });
  }

  upload(event: any) {
    const file = event.target.files[0];
    console.log(file);
    
    // create a random id
    const randomId = Math.random().toString(36).substring(2);
    const filePath = `images/${randomId}-${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadProgress = task.percentageChanges();
   
    this.uploadState = task
      .snapshotChanges()
      .pipe(
     finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();

          this.downloadURL.subscribe( (urlLink : any) => {
            if (urlLink) {
              //this.url = urlLink;
              this.userInfo.photoURL = urlLink;
              console.log(this.userInfo.photoURL)
            }
          });
        })
      )
  }

  //upload with promise
  // async upload(event: any) {
  //   const file = event.target.files[0];
  //   console.log('file: ' + file)
  //   if (file) {
  //     const path = `yt/${file.name}`;
  //     const uploadTask = await this.storage.upload(path, file);
  //     await uploadTask.ref.getDownloadURL().then((url) => {
  //       this.url = url;
  //       this.isLoading = false;
  //     });
  //     console.log('file: ' + file)
  //     this.userInfo.photoURL = this.url;
  //     this.isChoosedPicture = true;
  //   }
  //   else {
  //       this.isLoading = true;
  //   }
  // }

  saveProfilePicture() {
    this.auth.updateProfilePicture(this.uid, this.userInfo).subscribe({
      next: () => {
        //if(this.isChoosedPicture){
        this.isOpen = true;
        //}
        // else {
        //   this.serverMessage  = "Pls, attach picture."
        // }
      },
      error: (err) => (this.serverMessage = err.message),
    });
  }

  editProfile() {
    this.isOpen = false;
  }

  saveProfile(form: NgForm) {
    const { displayName, firstName, lastName, phone, address } = form.value;
    this.userInfo.uid = this.uid;
    this.userInfo.displayName = displayName;
    this.userInfo.firstName = firstName;
    this.userInfo.lastName = lastName;
    this.userInfo.phone = phone;
    this.userInfo.address = address;

    this.auth.updateProfileDocument(this.uid, this.userInfo).subscribe({
      next: () => {
        this.isOpen = true;
      },
      error: (err) => (this.serverMessage = err.message),
    });
  }

  backToProfile() {
    console.log(this.userInfo.firstName);
    console.log('userInfo-address: ' + this.userInfo.address);
    console.log('pchiuh');
    this.isOpen = true;
  }
}
