import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  domains = EMAIL_DOMAINS;
  serverMessage : string = '';

  constructor(private auth: AuthService, private router: Router, private location: Location){}

  login(form: NgForm){

      if (form.invalid) {
        return;
      }
  
      const { email, password } = form.value;
    
      this.auth.login(email!, password! ).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
       error: () => {
        this.serverMessage = 'Pls check your email and password or such user do not exist!';
        this.router.navigate(['/auth/login']);
      }
    });
  }

  signInWithGoogle(){
    this.auth.googleSignIn();
  }
}
