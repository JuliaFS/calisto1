import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

import { emailValidator } from 'src/app/shared/utils/email-validator';
import { matchPasswordsValidator } from 'src/app/shared/utils/match-passwords-validator';
import { EMAIL_DOMAINS } from 'src/app/constants';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  serverMessage : string = '';
  isAuthenticated : boolean = false;

  form = this.fb.group({
    displayName: ['', ],
    email: ['', [Validators.required, emailValidator(EMAIL_DOMAINS)]],
    passGroup: this.fb.group(
      {
        password: ['', [Validators.required]],
        rePassword: ['', [Validators.required]],
      },
      {
        validators: [matchPasswordsValidator('password', 'rePassword')],
      }
    ),
  });

  get passGroup() {
    return this.form.get('passGroup');
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  register(){
    if (this.form.invalid) {
      this.serverMessage = "Pls fill all fields corectly..."
      return;
    }
    const {
          email,
          displayName,
          passGroup: { password, rePassword } = {},
        } = this.form.value;

    this.auth
        .register(email!, displayName!, password!).subscribe({
          next: () => {
          this.router.navigate(['/home']);
          },
          error: (err) => this.serverMessage = err.message
       });
  }
}
