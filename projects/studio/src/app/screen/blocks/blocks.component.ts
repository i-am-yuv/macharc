import { Component, Input } from '@angular/core';
import { EffectAllowed } from 'ngx-drag-drop';

interface DraggableItem {
  name: string;
  content: string;
  effectAllowed: EffectAllowed;
  disable: boolean;
  handle: boolean;
  data?: any;
  children?: any[];
  id ?: any;
}

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.scss']
})
export class BlocksComponent {


  @Input() block!: DraggableItem;

  @Input() activeItem: any;


}
