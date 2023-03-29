import { Component, ContentChildren, Input, OnInit, QueryList, TemplateRef } from '@angular/core';
import { VTemplateDirective } from '@splenta/vezo';
import { twMerge } from 'tailwind-merge';


@Component({
  selector: 'vezo-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @ContentChildren(VTemplateDirective) templates!: QueryList<any>;

  media!: TemplateRef<any>;

  header!: TemplateRef<any>;

  body!: TemplateRef<any>;

  footer!: TemplateRef<any>;

  @Input() className: string = "";

  constructor() { }

  ngOnInit(): void {
    this.className = twMerge('shadow shadow-1 w-full', this.className);
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'media':
          this.media = item.templateRef;
          break;

        case 'header':
          this.header = item.templateRef;
          break;

        case 'body':
          this.body = item.templateRef;
          break;

        case 'footer':
          this.footer = item.templateRef;
          break;
      }
    })
  }

}
