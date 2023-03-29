import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputnumberComponent } from './inputnumber.component';
import { FormsModule } from '@angular/forms';
import { VezoModule } from '@splenta/vezo';



@NgModule({
  declarations: [
    InputnumberComponent
  ],
  imports: [
    CommonModule, FormsModule, VezoModule
  ],
  exports: [
    InputnumberComponent
  ]
})
export class InputnumberModule { }
