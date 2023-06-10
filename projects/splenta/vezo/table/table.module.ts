import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { IconModule } from '@splenta/vezo/icon';
import { VezoModule } from '@splenta/vezo';



@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule, IconModule, VezoModule
  ],
  exports: [
    TableComponent
  ]
})
export class TableModule { }
