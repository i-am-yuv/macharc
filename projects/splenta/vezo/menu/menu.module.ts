import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { RouterModule } from '@angular/router';
import { IconModule } from '@splenta/vezo/icon';



@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule, RouterModule, IconModule
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule { }
