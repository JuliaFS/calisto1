import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserProfile } from 'firebase/auth';
import { map, tap } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('profile', [
      state('void', style({
        transform: 'translateX(-100%)'
      })),
      transition('void <=> *', animate('0.5s ease-in'))
    ]),
  ]
})
export class ProfileComponent implements OnInit {
  serverMessage : string = '';
  userInfo: any = []; 
  uid : string = this.auth.getUserUid();
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

    //this.auth.currentAuthStatus$.subscribe(user => this.currentUserUid = user.uid);

    this.auth.getUserProfile(this.uid).subscribe({
      next: (user) => this.userInfo = user,
      error: (err) => this.serverMessage = err.message
    })
    // this.auth.getCurrentUserUid().subscribe(uid => {
    //   if(uid !== null){
    //     this.currentUserUid = uid;
    //   }
    // });
    // this.user$.pipe(
    //  tap(user => console.log(user!.uid)),
    //   map(user => this.uid = user!.uid)
    // )
    // console.log('uid: ' + this.uid)

    //this.auth.getCurrentUserUid().subscribe({
    //   next: uid => {
    //     this.currentUserUid = uid;
    //     //console.log(this.currentUserUid)
    //       this.auth.getUserProfile(this.currentUserUid).subscribe({
    //         next: (user) => this.userInfo = user,
    //         error: (err) => this.serverMessage = err.message
    //       })
    //   },
    //   error: err => {
    //     //console.error('Error getting current user UID:', err);
    //     this.serverMessage = err.message;
    //   }
    // });


  }

}
