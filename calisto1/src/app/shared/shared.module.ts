import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoaderComponent } from './loader/loader.component';
import { EmailDirective } from './validators/email.directive';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    LoaderComponent,
    ModalComponent,
    EmailDirective,
  ],
  imports: [
    CommonModule, 
    RouterModule],
  exports: [
    LoaderComponent,
    ModalComponent,
    EmailDirective,
  ],
})
export class SharedModule { }
