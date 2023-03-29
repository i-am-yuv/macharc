import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast.component';
import { IconModule } from '@splenta/vezo/icon';



@NgModule({
  declarations: [
    ToastComponent
  ],
  imports: [
    CommonModule, IconModule
  ],
  exports: [
    ToastComponent
  ]
})
export class ToastModule { }
