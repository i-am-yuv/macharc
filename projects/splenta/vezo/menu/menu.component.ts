import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropDownAnimation } from './animate';

@Component({
  selector: 'vezo-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    DropDownAnimation
  ]
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() items: any[] = [];

  @Output() itemClick: EventEmitter<any> = new EventEmitter();

  toggleSubMenu(item: any) {
    if (item.showSubMenu === true) {
      this.items.forEach(t => t.showSubMenu = false);
      item.showSubMenu = false;
    } else {
      this.items.forEach(t => t.showSubMenu = false);
      item.showSubMenu = true;
    }
  }

  clickHandler(item: any) {
    this.itemClick.emit(item);
  }

}
