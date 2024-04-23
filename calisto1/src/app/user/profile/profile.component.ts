import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserProfile } from 'firebase/auth';
import { map, tap } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ProfileUser } from 'src/app/shared/types/userProfile';
import { NgForm } from '@angular/forms';

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
      transition('void <=> *', animate('0.5s ease-out'))
    ]),
  ],
})
export class ProfileComponent implements OnInit {

  serverMessage : string = '';
  userInfo: any = []; 
  uid : string = '';
  email: string = '';
  isOpen : boolean = true;

  // getUserEmail() : string | null{
  //   return this.auth.getUserEmail();
  // }

  // getUserUid(){
  //   return this.auth.getCurrentUserUid();
  // }

  profileObj : ProfileUser = {
    uid: '',
    displayName: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  };
  //currentUserUid: string = '';

 // user$ = this.auth.currentUser$!;


  constructor(
    //private imageUploadService: ImageUploadService,
    //private toast: HotToastService,
   // private usersService: UsersService,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    //this.auth.currentAuthStatus$.subscribe(user => this.userInfo = user);
    this.auth.currentAuthStatus$.subscribe(user => console.log('user: ' + user));
    this.auth.currentAuthStatus$.subscribe(user => {
      this.uid = user?.uid;
      this.email = user?.email;
  });
  

    // this.auth.getUserProfile(this.userInfo.uid).subscribe({
    //   next: (user) => this.userInfo = user,
    //   error: (err) => this.serverMessage = err.message
    // })


    // this.auth.getCurrentUserUid().subscribe({
    //   next: uid => {
    //     this.uid = uid;
        //console.log(this.currentUserUid)
          this.auth.getUserProfile(this.uid).subscribe({
            next: (user) => this.userInfo = user,
            error: (err) => this.serverMessage = err.message
          })
     // },
    //   error: err => {
    //     //console.error('Error getting current user UID:', err);
    //     this.serverMessage = err.message;
    //   }
    // });

    
  }

  editProfile(){
    this.isOpen = false;
  }

  saveProfile(form: NgForm){
    //this.isOpen = !this.isOpen;

    // if (form.invalid) {
    //   return;
    // }

    // if (form.invalid) {
    //   this.serverMessage = 'Pls fill all fields corectly!';
    //   return;
    // }

    const { displayName, firstName, lastName, phone, address } = form.value;
    console.log('dispayName: ' + displayName)
    this.profileObj.uid = this.uid;
    console.log('display uid: ' + this.profileObj.uid)
    console.log('display name: ' + this.profileObj.displayName)
    this.profileObj.displayName = displayName;
    this.profileObj.firstName = firstName;
    this.profileObj.lastName = lastName;
    this.profileObj.phone = phone;
    this.profileObj.address = address;

    //this.companyObj.owner = this.ownerVar;
    console.log('this.profileObj.uid: ' + this.profileObj.uid);
    this.auth.createUserProfileDocument(this.uid, this.profileObj)
    .subscribe({
      next: () => this.isOpen = true ,
      error: (err) => this.serverMessage = err.message
    })
    // .then(() => {
    //   console.log(this.profileObj)
    //   //this.resetForm();
    //   this.router.navigate(['/company/company-list']);
    // }, err => {
    //   console.log(err.message);
    //   this.serverMessage = err.message;
    // } );
  }

  // toggle() {
  //   this.isOpen = !this.isOpen;
  // }

  backToProfile(){
    this.auth.getUserProfile(this.uid).subscribe({
      next: (user) => {
        this.userInfo = user;
        this.isOpen = true;
      },
      error: (err) => this.serverMessage = err.message
    })
  }

}
