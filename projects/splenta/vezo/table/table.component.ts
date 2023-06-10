import { Component, ContentChildren, EventEmitter, Input, OnInit, Output, QueryList, SimpleChanges, TemplateRef } from '@angular/core';
import { VTemplateDirective, Pagination } from '@splenta/vezo';

@Component({
  selector: 'vezo-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  @ContentChildren(VTemplateDirective) templates!: QueryList<any>;

  @Input() actionBar = false;

  @Input() pagination = true;

  @Input() toolBar = false;

  @Input() data: any[] = [];

  @Output() pageDataChange: EventEmitter<boolean> = new EventEmitter();

  caption!: TemplateRef<any>;

  header!: TemplateRef<any>;

  body!: TemplateRef<any>;

  footer!: TemplateRef<any>;

  showPageOpts: boolean = false;

  @Input() pageData: Pagination = {};

  math = Math;
  showPageNos: boolean = false;

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

  pageIncrement() {
    if (this.pageData.pageNo !== undefined) {
      this.pageData.pageNo = this.pageData.pageNo + 1;
      this.pageDataChange.emit(true);
    }
  }
  pageDecrement() {
    if (this.pageData.pageNo && this.pageData.pageNo > 0) {
      this.pageData.pageNo = this.pageData.pageNo - 1;
      this.pageDataChange.emit(true);
    }
  }

  selectOpts(opt: any) {
    this.pageData.pageSize = opt;
    this.showPageOpts = false;
    this.pageDataChange.emit(true);
  }
  closeOpts() {
    this.showPageOpts = false;
  }

  getTotalPages(): any {
    return (this.pageData &&
      this.pageData.pageSize &&
      this.pageData.totalElements) ?
      this.math.ceil(this.pageData.totalElements / this.pageData.pageSize) : 0;
  }

  changePage(pn: number) {
    this.pageData.pageNo = pn;
    this.pageDataChange.emit(true);
    this.showPageNos = false;
  }


  getPageRange() {
    var str = '';
    if (this.pageData && this.pageData.pageSize != undefined && this.pageData.offset != undefined) {
      str = ((this.pageData.offset === 0) ? 1 : this.pageData.offset).toString();
      str += ' - ';
      if (this.pageData.pageSize > this.data.length) {
        str += (this.data.length).toString();
      } else {
        str += (this.pageData.pageSize + this.pageData.offset).toString();
      }
      str += ' of ';
      str += this.pageData.totalElements?.toString();

      str += ' Items';
    }
    return str;
  }

}

