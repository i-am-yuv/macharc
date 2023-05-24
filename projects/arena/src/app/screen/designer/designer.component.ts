import { Component, OnInit } from '@angular/core';
import { DndDropEvent, DropEffect, EffectAllowed } from 'ngx-drag-drop';
import { ScreenService } from '../screen.service';
import { ActivatedRoute } from '@angular/router';
import { Screen } from '../screen';
import { FieldService } from '../../fields/field.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { Field } from '../../fields/field';
import { MessageService } from '@splenta/vezo';

interface DropzoneLayout {
  container: string;
  list: string;
  dndHorizontal: boolean;
}
interface DraggableItem {
  name: string;
  content: string;
  effectAllowed: EffectAllowed;
  disable: boolean;
  handle: boolean;
  data?: any;
  children?: any[]
}
@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {

  draggableListLeft: DraggableItem[] = [
    {
      name: 'table',
      content: 'Table',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { caption: 'Table Heading' }
    },
    {
      name: 'heading',
      content: 'Heading',
      data: { text: 'Heading' },
      effectAllowed: 'copy',
      disable: false,
      handle: false
    }, {
      name: 'section',
      content: 'Section 2 columns',
      data: { columns: 2 },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: []
    },
    {
      name: 'section',
      content: 'Section 3 columns',
      data: { columns: 3 },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: []
    },
    {
      name: 'input',
      content: 'Input',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label' }
    },
    {
      name: 'dropdown',
      content: 'Dropdown',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label' }
    },
    {
      name: 'textarea',
      content: 'Textarea',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label' }
    },
    {
      name: 'button',
      content: 'Button',
      effectAllowed: 'copy',
      disable: false,
      handle: true,
      data: { label: 'Input Label' }
    },
    {
      name: 'checkbox',
      content: 'Checkbox',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label' }
    },
    {
      name: 'radio',
      content: 'Radio',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label' }
    },
    {
      name: 'switch',
      content: 'Switch',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label' }
    },

  ];

  draggableListRight: DraggableItem[] = [

  ];

  screenData: Screen = {};

  private readonly verticalLayout: DropzoneLayout = {
    container: 'row',
    list: 'column',
    dndHorizontal: false,
  };
  layout: DropzoneLayout = this.verticalLayout;
  showProps: boolean = false;
  activeItem: any;
  screenId: string | null = '';
  fields: Field[] = [];

  constructor(
    private screenService: ScreenService,
    private fieldService: FieldService,
    private route: ActivatedRoute,
    private msgService: MessageService
  ) {

  }
  public ngOnInit() {
    this.screenId = this.route.snapshot.paramMap.get('id');
    this.screenService.getData({ id: this.screenId }).then((res: any) => {
      this.screenData = res;
      if (res.screenDefinition)
        this.draggableListRight = JSON.parse(res.screenDefinition);
      if (this.screenData) {
        var filterStr = FilterBuilder.equal('collection.id', this.screenData?.collection?.id!);
        this.fieldService.getAllData(undefined, undefined, undefined, undefined, filterStr).then((res: any) => {
          this.fields = res.content;
        });
      }
    })

  }
  onDragged(item: any, list: any[], effect: DropEffect) {
    // this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;

    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }
  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }
      event.data['id'] = Math.floor(Math.random() * 1000000);
      list.splice(index, 0, event.data);

      this.activeItem = event.data;

    }
  }

  saveDefinition() {
    this.screenData.screenDefinition = JSON.stringify(this.draggableListRight);
    this.screenService.updateData(this.screenData).then((res: any) => {
      this.msgService.add({ severity: 'success', summary: 'Updated', detail: 'Definition updated' });
    })
  }

  generateComponent() {
    this.screenService.generateComponent(this.screenData).then((res: any) => {
      this.msgService.add({ severity: 'success', summary: 'Generated', detail: 'Code Generated' });
    })
  }

  deleteActiveItem(val: boolean) {
    this.draggableListRight.splice(this.draggableListRight.findIndex((a: any) => a.id === this.activeItem.id), 1);
  }

}