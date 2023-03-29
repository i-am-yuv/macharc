import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from './accordion.component';
import { VezoAccordionSectionComponent } from './accordion-section.component';

@NgModule({
  declarations: [
    AccordionComponent, VezoAccordionSectionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AccordionComponent, VezoAccordionSectionComponent
  ]
})
export class AccordionModule { }
