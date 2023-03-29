import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { IconModule } from '@splenta/vezo/icon';

@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule, IconModule
  ],
  exports: [
    ModalComponent
  ]
})
export class ModalModule { }
