import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-widget-tree-node',
  templateUrl: './widget-tree-node.component.html',
  styleUrls: ['./widget-tree-node.component.scss'],
})
export class WidgetTreeNodeComponent implements OnInit {
  @Input() node: any;
  @Output() nodeClicked = new EventEmitter<any>();
  @Output() copyClicked = new EventEmitter<any>();
  @Output() pasteClicked = new EventEmitter<any>();

  isExpanded: boolean = false;

  ngOnInit(): void {}

  toggle(): void {
    // for form or component we wont be able to see the nested elements
    if (this.hasChildren() && this.node.name != 'form') {
      this.isExpanded = !this.isExpanded;
    }
  }

  hasChildren(): boolean {
    return this.node.children && this.node.children.length > 0;
  }

  handleClick(event: Event, node: any) {
    event.stopPropagation(); // Stop the event from bubbling up
    this.nodeClicked.emit(node);
  }

  copyClick(event: Event, node: any) {
    event.stopPropagation(); // Stop the event from bubbling up

    this.copyClicked.emit(node);
  }

  pasteClick(event: Event, node: any) {
    event.stopPropagation(); // Stop the event from bubbling up

    this.pasteClicked.emit(node);
  }

  onChildNodeClicked(node: any) {
    this.nodeClicked.emit(node);
  }

  onChildCopyClicked(node: any) {
    this.copyClicked.emit(node);
  }

  onChildPasteClicked(node: any) {
    this.pasteClicked.emit(node);
  }

  checkComponentAvailable() {
    if (
      localStorage.getItem('componentCopy') != null ||
      localStorage.getItem('componentPage') != null
    ) {
      return true;
    } else {
      return false;
    }
  }
}
