import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-widget-tree-node',
  templateUrl: './widget-tree-node.component.html',
  styleUrls: ['./widget-tree-node.component.scss']
})
export class WidgetTreeNodeComponent implements OnInit {

  @Input() node: any;
  @Output() nodeClicked = new EventEmitter<any>();
  isExpanded: boolean = false;

  ngOnInit(): void {
  }

  toggle(): void {
    if (this.hasChildren()) {
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

  onChildNodeClicked(node: any) {
    this.nodeClicked.emit(node);
  }

}
