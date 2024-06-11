import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { DropEffect, DndDropEvent, EffectAllowed } from 'ngx-drag-drop';
import { Collection } from '../../collection/collection';
import { CollectionService } from '../../collection/collection.service';
import { Field } from '../../fields/field';
import { FieldService } from '../../fields/field.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { DataForm } from '../data-form';
import { DataFormService } from '../data-form.service';


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
  selector: 'app-form-designer',
  templateUrl: './form-designer.component.html',
  styleUrls: ['./form-designer.component.scss']
})
export class FormDesignerComponent implements OnInit {


  draggableListLeft: DraggableItem[] = [
    {
      name: 'heading',
      content: 'Heading',
      data: { text: 'Heading', fontSize:'14' ,fontWeight :'400', fontColor:'#000000', alignment:'start'  },
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
      data: { label: 'Input Label', labelFont: '14', labelWeight:'400', labelColor: '#000000' , fieldHeight:'35' , fieldRadius:'4', fillColor: '#f1f3f6', borderColor:'#f1f3f6' , borderWidth:'1' }
    },
    {
      name: 'dropdown',
      content: 'Dropdown',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label', labelFont: '14', labelWeight:'400', labelColor: '#000000' , fieldHeight:'35' , fieldRadius:'4', fillColor: '#f1f3f6', borderColor:'#f1f3f6' , borderWidth:'1' }
    },
    {
      name: 'textarea',
      content: 'Textarea',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label', labelFont: '14', labelWeight:'400', labelColor: '#000000'  }
    },
    {
      name: 'button',
      content: 'Button',
      effectAllowed: 'copy',
      disable: false,
      handle: true,
      data: { label: 'Input Label',btnTextFont: '12', btnTextWeight:'600', btnTextColor: '#4338ca',
              bgColor:'#e0e7ff',borderColor:'#c7d2fe',borderWidth:'1',borderRadius:'4', width:'100', height:'35',
              btnAlignment:'center', textAlignment:'center'
       }
    },
    {
      name: 'checkbox',
      content: 'Checkbox',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label',labelFont: '14', labelWeight:'400', labelColor: '#000000'  }
    },
    {
      name: 'radio',
      content: 'Radio',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label' ,labelFont: '14', labelWeight:'400', labelColor: '#000000' }
    },
    {
      name: 'switch',
      content: 'Switch',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Label' ,labelFont: '14', labelWeight:'400', labelColor: '#000000' }
    },

  ];

  draggableListRight: DraggableItem[] = [

  ];

  formData: DataForm = {};

  private readonly verticalLayout: DropzoneLayout = {
    container: 'row',
    list: 'column',
    dndHorizontal: false,
  };
  layout: DropzoneLayout = this.verticalLayout;
  showProps: boolean = false;
  activeItem: any;
  formId: string | null = '';
  fields: Field[] = [];
  collections: Collection[] = [];

  rightPanelExpanded : boolean =  true;

  constructor(
    private formService: DataFormService,
    private fieldService: FieldService,
    private collectionService: CollectionService,
    private route: ActivatedRoute,
    private msgService: MessageService
  ) {

  }
  public ngOnInit() {
    this.formId = this.route.snapshot.paramMap.get('id');
    this.formService.getData({ id: this.formId }).then((res: any) => {
      this.formData = res;
      if (res.formDefinition)
        this.draggableListRight = JSON.parse(res.formDefinition);
      if (this.formData) {
        var filterStr = FilterBuilder.equal('collection.id', this.formData?.collection?.id!);
        this.fieldService.getAllData(undefined, filterStr).then((res: any) => {
          this.fields = res.content;
        });
        this.collectionService.getAllData().then((res: any) => {
          this.collections = res.content;
        })
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
    this.formData.formDefinition = JSON.stringify(this.draggableListRight);
    this.formService.updateData(this.formData).then((res: any) => {
      this.msgService.add({ severity: 'success', summary: 'Updated', detail: 'Definition updated' });
    })
  }

  generateComponent() {
    this.formService.generateComponent(this.formData).then((res: any) => {
      this.msgService.add({ severity: 'success', summary: 'Generated', detail: 'Code Generated' });
    })
  }

  deleteActiveItem(val: boolean) {
    this.draggableListRight.splice(this.draggableListRight.findIndex((a: any) => a.id === this.activeItem.id), 1);
    var newItem: any;
    this.activeItem = newItem;
  }

  handleClick(event: MouseEvent, item: any) {
    event.stopPropagation();
    this.activeItem = item;
  }

  onClickPickElement() {
    var newItem: any;
    this.activeItem = newItem;
  }

}
