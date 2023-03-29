import { DOCUMENT } from '@angular/common';
import { Component, ContentChildren, EventEmitter, Inject, Input, OnInit, Output, QueryList, Renderer2, TemplateRef } from '@angular/core';
import { VTemplateDirective } from '@splenta/vezo';
import { SideBarAnimationEnterLeave, SideBarAnimationInOut } from './animate';

@Component({
  selector: 'vezo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    SideBarAnimationEnterLeave, SideBarAnimationInOut
  ]
})
export class SidebarComponent implements OnInit {

  @Input() visible: boolean = false;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ContentChildren(VTemplateDirective) templates!: QueryList<any>;

  header!: TemplateRef<any>;

  content!: TemplateRef<any>;

  footer!: TemplateRef<any>;

  move = false

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) { }

  closeModal() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.renderer.removeStyle(this.document.body, 'position');
  }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (this.visible) {
      this.renderer.setStyle(this.document.body, 'position', 'fixed');
      this.renderer.setStyle(this.document.body, 'width', '100%');
      this.move = true;
    } else {
      this.renderer.removeStyle(this.document.body, 'position');
      this.move = false;
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(this.document.body, 'position');
  }

  ngAfterContentInit() {
    this.templates.forEach((item) => {
      switch (item.getType()) {
        case 'header':
          this.header = item.templateRef;
          break;

        case 'content':
          this.content = item.templateRef;
          break;

        case 'footer':
          this.footer = item.templateRef;
          break;
      }
    })
  }

}
