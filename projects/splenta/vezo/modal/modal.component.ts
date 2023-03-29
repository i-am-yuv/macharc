import { DOCUMENT } from '@angular/common';
import { Component, ContentChildren, EventEmitter, Inject, Input, OnInit, Output, QueryList, Renderer2, TemplateRef } from '@angular/core';
import { VTemplateDirective } from '@splenta/vezo';

@Component({
  selector: 'vezo-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() visible: boolean = false;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ContentChildren(VTemplateDirective) templates!: QueryList<any>;

  header!: TemplateRef<any>;

  content!: TemplateRef<any>;

  footer!: TemplateRef<any>;


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
    } else {
      this.renderer.removeStyle(this.document.body, 'position');
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
