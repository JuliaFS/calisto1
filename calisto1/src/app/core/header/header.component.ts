import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/user/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public auth: AuthService, private router: Router) {};


  get isLogged(): boolean {
    return this.auth.isLogged;
  }


  logout() {
    // this.auth.logout().subscribe({
    //   next: () => {
    //     this.router.navigate(['/home']);
    //   },
    //   error: () => {
    //     this.router.navigate(['/auth/login']);
    //   },
    // });
  }
  
}
