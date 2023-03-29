import { NgModule } from '@angular/core';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { ClickOutsideDirective } from './click-outside.directive';
import { VTemplateDirective } from './v-template.directive';



@NgModule({
  declarations: [
    NumbersOnlyDirective,
    ClickOutsideDirective,
    VTemplateDirective
  ],
  imports: [
  ],
  exports: [
    NumbersOnlyDirective,
    ClickOutsideDirective,
    VTemplateDirective,
  ]
})
export class VezoModule { }
