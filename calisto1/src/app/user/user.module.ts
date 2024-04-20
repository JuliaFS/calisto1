import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { UserRoutingModule } from './user-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
