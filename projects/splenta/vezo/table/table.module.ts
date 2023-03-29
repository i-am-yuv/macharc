import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { IconModule } from '@splenta/vezo/icon';



@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule, IconModule
  ],
  exports: [
    TableComponent
  ]
})
export class TableModule { }
