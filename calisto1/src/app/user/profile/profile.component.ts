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
  url: string = '';
  isOpen: boolean = true;
  serverMessage: string = '';

  userInfo: ProfileUser = {
    uid: this.uid,
    displayName: '-',
    firstName: '-',
    lastName: '-',
    phone: '-',
    address: '-',
    photoURL: '-',
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

  async upload(event: any) {
    const file = event.target.files[0];
    console.log('file: ' + file);
    if (file) {
      const path = `yt/${file.name}`;
      const uploadTask = await this.storage.upload(path, file);
      await uploadTask.ref.getDownloadURL().then((url) => {
        this.url = url;
      });
      this.userInfo.photoURL = this.url;
    }
  }

  saveProfilePicture() {
    this.auth.updateProfilePicture(this.uid, this.userInfo).subscribe({
      next: () => {
        this.isOpen = true;
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
