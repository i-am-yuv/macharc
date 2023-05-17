import { Component, ContentChildren, Input, OnInit, QueryList, TemplateRef } from '@angular/core';
import { VTemplateDirective } from '@splenta/vezo';

@Component({
  selector: 'vezo-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  @ContentChildren(VTemplateDirective) templates!: QueryList<any>;

  @Input() actionBar = false;

  @Input() toolBar = false;

  @Input() data: any[] = [];

  caption!: TemplateRef<any>;

  header!: TemplateRef<any>;

  body!: TemplateRef<any>;

  footer!: TemplateRef<any>;
  showPageOpts: boolean = false;
  @Input() pageSize: number = 10;

  math = Math;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'caption':
          this.caption = item.templateRef;
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

  selectOpts(opt: any) {
    this.pageSize = opt;
    this.showPageOpts = false;

  }
  closeOpts() {
    this.showPageOpts = false;
  }
}

