import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-tree-node',
  templateUrl: './widget-tree-node.component.html',
  styleUrls: ['./widget-tree-node.component.scss']
})
export class WidgetTreeNodeComponent implements OnInit {

  @Input() node: any;
  isExpanded: boolean = false;

  ngOnInit(): void {
    console.log('this is node');
    console.log(this.node);
  }

  toggle(): void {
    if (this.hasChildren()) {
      this.isExpanded = !this.isExpanded;
    }
  }

  hasChildren(): boolean {
    return this.node.children && this.node.children.length > 0;
  }

}
