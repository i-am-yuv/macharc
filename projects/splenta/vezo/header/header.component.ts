import { Component, ContentChildren, Input, OnInit, QueryList, TemplateRef } from '@angular/core';
import { VTemplateDirective } from '@splenta/vezo';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ContentChildren(VTemplateDirective) templates!: QueryList<any>;

  left!: TemplateRef<any>;

  right!: TemplateRef<any>;

  middle!: TemplateRef<any>;

  @Input() className: string = "";

  constructor() { }

  ngOnInit(): void {
    this.className = twMerge('w-full', this.className);
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'left':
          this.left = item.templateRef;
          break;

        case 'right':
          this.right = item.templateRef;
          break;

        case 'middle':
          this.middle = item.templateRef;
          break;
      }
    })
  }

}
