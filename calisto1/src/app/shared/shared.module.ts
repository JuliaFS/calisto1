import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { EmailDirective } from './validators/email.directive';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    LoaderComponent,
    EmailDirective,
    ModalComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    LoaderComponent,
    EmailDirective,
  ],
})
export class SharedModule { }
