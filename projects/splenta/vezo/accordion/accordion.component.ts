import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vezo-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {

  @Input() sections: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  toggleSection(item: any) {
    if (item.showSection === true) {
      this.sections.forEach(t => t.showSection = false);
      item.showSection = false;
    } else {
      this.sections.forEach(t => t.showSection = false);
      item.showSection = true;
    }
  }

}
