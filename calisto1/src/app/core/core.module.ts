import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
  ]
})
export class CoreModule { }
