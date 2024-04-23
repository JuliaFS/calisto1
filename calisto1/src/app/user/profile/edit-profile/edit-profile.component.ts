import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { NonNullableFormBuilder } from '@angular/forms'
import { ProfileUser } from 'src/app/shared/types/userProfile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit{
  userInfo : any = [];
  serverMessage : string = '';
  uid : string = this.auth.getUserUid();

  profileObj : ProfileUser = {
    uid: '',
    displayName: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  };

  getUserEmail() : string | null{
    return this.auth.getUserEmail();
  }

  constructor(
    //private imageUploadService: ImageUploadService,
    //private toast: HotToastService,
   // private usersService: UsersService,
    private auth: AuthService,
    private router: Router,
    private fb: NonNullableFormBuilder
  ) {
    //this.auth.currentAuthStatus$.subscribe(user => this.uid = user.uid);
  }

  ngOnInit(): void {
    console.log('user uid in edit-profile: ' + this.uid)
    this.auth.getUserProfile(this.uid).subscribe({
      next: (user) => this.userInfo = user,
      error: (err) => this.serverMessage = err.message
    })
  }

  saveProfile(form: NgForm){

    if (form.invalid) {
      return;
    }

    if (form.invalid) {
      this.serverMessage = 'Pls fill all fields corectly!';
      return;
    }

    const { displayName, firstName, lastName, phone, address } = form.value;

    this.profileObj.displayName = displayName;
    this.profileObj.firstName = firstName;
    this.profileObj.lastName = lastName;
    this.profileObj.phone = phone;
    this.profileObj.address = address;

    //this.companyObj.owner = this.ownerVar;
    
    this.auth.createUserProfileDocument(this.profileObj.uid, this.profileObj)
    .subscribe({
      next: () =>   this.router.navigate(['/auth/profile']),
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
}
