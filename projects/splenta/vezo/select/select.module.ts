import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { FormsModule } from '@angular/forms';
import { VezoModule } from '@splenta/vezo';



@NgModule({
  declarations: [
    SelectComponent
  ],
  imports: [
    CommonModule, FormsModule, VezoModule
  ],
  exports: [
    SelectComponent
  ]
})
export class SelectModule { }
