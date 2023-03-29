import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AccordionSectionService } from './accordion-section.service';
import { AccordionSectionAnimation } from './animate';

@Component({
  selector: 'vezo-accordion-section',
  templateUrl: './accordion-section.component.html',
  styleUrls: ['./accordion-section.component.scss'],
  animations: [
    AccordionSectionAnimation
  ]
})
export class VezoAccordionSectionComponent implements OnInit {

  @Input() header: string = "";

  @Input() showSection: boolean = false;

  constructor(private accordionSectionService: AccordionSectionService) {

  }

  ngOnInit(): void {
    this.accordionSectionService.isAccordionSectionVisible = this.showSection;
    this.accordionSectionService.AccordionSectionVisibilityChange.subscribe(value => {
      this.showSection = this.accordionSectionService.isAccordionSectionVisible;
    });
  }

  toggleSection() {
    this.accordionSectionService.hideAllAccordionSections();
    this.showSection = true;
  }
}
