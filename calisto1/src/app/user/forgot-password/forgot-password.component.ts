import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { EMAIL_DOMAINS } from 'src/app/constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  domains = EMAIL_DOMAINS;
  serverMessage : string = '';

  constructor( private auth: AuthService, private router: Router ) {}

   forgotPassword(form: NgForm){
    if (form.invalid) {
      return;
    }

    const { email } = form.value;

     this.auth.forgotPassword(email)
     .subscribe({
      next: () => {
        this.router.navigate(['/home']);
        this.serverMessage = "You can check your mail for recovering password.";
      },
      error: error => {
        this.serverMessage = error.message;
        // this.snackBar.open(error.message, "OK", {
        //   duration: 5000
        // });
      }
    })
  }
}
