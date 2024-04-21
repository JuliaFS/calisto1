import { Component } from '@angular/core';
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
export class EditProfileComponent {
  serverMessage : string = '';
  //user$ = this.auth.getCurrentUser;
  profileForm : ProfileUser[] = [];
  profileObj : ProfileUser = {
    uid: this.auth.getUserUid(),
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
  ) {}

  ngOnInit(): void {
   
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
