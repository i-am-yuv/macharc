import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { IconModule } from '@splenta/vezo/icon';



@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule, IconModule
  ],
  exports: [
    ButtonComponent
  ]
})
export class ButtonModule { }
