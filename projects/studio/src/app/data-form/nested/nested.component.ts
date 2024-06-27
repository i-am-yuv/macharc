import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

@Component({
  selector: 'app-nested',
  templateUrl: './nested.component.html',
  styleUrls: ['./nested.component.scss']
})
export class NestedComponent implements OnInit {

  @Input() nestedElement!: string;
  @Input() isParentForm: boolean = false;



  @Input() child: any;
  @Input() layout: any;
  activeItem: any;
  @Output() nodeClicked = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
    //alert(JSON.stringify(this.row));
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move') && this.isParentForm == false) {
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }
      event.data['id'] = Math.floor(Math.random() * 1000000);
      list.splice(index, 0, event.data);

      this.activeItem = event.data;
      this.nodeClicked.emit(this.activeItem);

      // // Ensure event.data is an object and has no previous id
      // if (event.data && typeof event.data === 'object') {
      //   const newItem = { ...event.data, id: Math.floor(Math.random() * 1000000) };
      //   list.splice(index, 0, newItem);
      //   this.activeItem = newItem;
      //   this.nodeClicked.emit(this.activeItem);
      // } else {
      //   console.error('Invalid data dropped:', event.data);
      // }

    }
  }

  handleClick(event: MouseEvent, item: any) {
    if (this.isParentForm == false) {
      event.stopPropagation();
      //  console.log(this.activeItem);
      this.nodeClicked.emit(item);
    }

  }

  onChildNodeClicked(node: any) {
    if (this.isParentForm == false) {
      this.nodeClicked.emit(node);
    }
  }
}
