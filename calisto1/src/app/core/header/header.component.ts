import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/user/auth.service';
import { AngularFireAuth  } from '@angular/fire/compat/auth';

import { getAuth, onAuthStateChanged } from "firebase/auth";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  //displayName : string | null = null;
  isAuthenticated : boolean = false;
  email: string = '';
  //user: firebase.User | null = null;

  constructor(public auth: AuthService, fireAuth: AngularFireAuth, private router: Router) {};

  // get displayUserEmail(): string | null{
  //    return this.auth.getUserEmail();
  // }

  ngOnInit(): void {
     //this.auth.currentAuthStatus$.subscribe(authStatus => this.isAuthenticated = authStatus);
     this.auth.currentAuthStatus$.subscribe(authStatus => {
      this.isAuthenticated = authStatus;
      this.email = authStatus?.email;
  });
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: () => {
        this.router.navigate(['/auth/login']);
      },
    });
  }
  
}
