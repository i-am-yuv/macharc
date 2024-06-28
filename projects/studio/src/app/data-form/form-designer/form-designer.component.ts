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
  children?: any[];
  icon?: any;
  id?: any;
}
@Component({
  selector: 'app-form-designer',
  templateUrl: './form-designer.component.html',
  styleUrls: ['./form-designer.component.scss']
})
export class FormDesignerComponent implements OnInit {

  // No use of this
  draggableListLeft: DraggableItem[] = [
    // {
    //   name: 'section',
    //   content: 'Columns 2',
    //   data: { columns: 2 , gap:'16' , startSpacing:'16', endSpacing:'16'
    //   },
    //   effectAllowed: 'copy',
    //   disable: false,
    //   handle: false,
    //   children: [],
    //   icon: 'assets/column.svg'
    // },
    // {
    //   name: 'section',
    //   content: 'Columns 3',
    //   data: { columns: 3 , gap:'16' , startSpacing:'16', endSpacing:'16'
    //    },
    //   effectAllowed: 'copy',
    //   disable: false,
    //   handle: false,
    //   children: [],
    //   icon: 'assets/column.svg'
    // },
  ];

  // Virtual Elements
  draggableListLeftVE: DraggableItem[] = [
    {
      name: 'heading',
      content: 'Text',
      data: {
        text: 'Text', fontSize: '14', fontWeight: '400', fontColor: '#000000', alignment: 'start', vAlignment: 'start',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      icon: 'assets/textField.svg'
    },
    {
      name: 'input',
      content: 'Input',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        label: 'Input Label', placeholder: 'Placeholder', labelFont: '14', labelWeight: '400', labelColor: '#000000', fieldHeight: '35', fieldRadius: '4', fillColor: '#f1f3f6', borderColor: '#f1f3f6', borderWidth: '1',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      icon: 'assets/button.svg'
    },
    {
      name: 'dropdown',
      content: 'Dropdown',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        label: 'Input Label', placeholder: 'Placeholder', labelFont: '14', labelWeight: '400', labelColor: '#000000', fieldHeight: '35', fieldRadius: '4', fillColor: '#f1f3f6', borderColor: '#f1f3f6', borderWidth: '1',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      }
      , icon: 'assets/dropdown_N.svg'
    },
    {
      name: 'textarea',
      content: 'Textarea',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        label: 'Input Label', placeholder: 'Placeholder', labelFont: '14', labelWeight: '400', labelColor: '#000000', fieldHeight: '50', fillColor: '#f1f3f6', borderColor: '#f1f3f6', borderWidth: '1', borderRadius: '4',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      }
      , icon: 'assets/Text Area_N.svg'
    },
    {
      name: 'button',
      content: 'Button',
      effectAllowed: 'copy',
      disable: false,
      handle: true,
      data: {
        label: 'Input Label', btnTextFont: '12', btnTextWeight: '600', btnTextColor: '#4338ca',
        bgColor: '#e0e7ff', borderColor: '#c7d2fe', borderWidth: '1', borderRadius: '4', width: '100', height: '35',
        btnAlignment: 'center', textAlignment: 'center',
        mt: '0', mb: '0', ml: '0', mr: '0'
      },
      icon: 'assets/button.svg'
    },
    {
      name: 'checkbox',
      content: 'Checkbox',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        label: 'Input Label', labelFont: '14', labelWeight: '400', labelColor: '#000000',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      icon: 'assets/checkBox.svg'
    },
    {
      name: 'radio',
      content: 'Radio',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        label: 'Input Label', labelFont: '14', labelWeight: '400', labelColor: '#000000',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      icon: 'assets/Radio-button_N.svg'

    },
    {
      name: 'switch',
      content: 'Switch',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        label: 'Input Label', labelFont: '14', labelWeight: '400', labelColor: '#000000',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      icon: 'assets/toggleOn.svg'
    },
    {
      name: 'image',
      content: 'Image',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0', alignment: 'start',
        width: '200', height: '100', url: 'https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg'
      },
      icon: 'assets/image.svg'
    },
    {
      name: 'video',
      content: 'Video',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0', alignment: 'start',
        width: '200', url: 'https://elementor.com/wp-content/uploads/2023/09/02_MainVideo_1066_600_1-1.mp4'
      },
      icon: 'assets/ph_video-light.svg'
    }
  ];

  // Layout Elements
  draggableListLeftLE: DraggableItem[] = [
    {
      name: 'container',
      content: 'Container',
      data: {
        width: '100', height: '100', bgColor: '#f1f3f6', gap: '0', columns: '2', alignment: 'start', vAlignment: 'center',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0', bgImage: '', borderWidth: '0' , borderColor:'#FFFFFF', borderRadius:'0'
       , shadow :'none'},
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
      icon: 'assets/button.svg'
    },
    {
      name: 'grid',
      content: 'Grid',
      data: {
        columns: 2, gap: '4', mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0',
        alignment: 'start', vAlignment: 'start',
      },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
      icon: 'assets/bitcoin-icons_grid-outline.svg'

    },
    {
      name: 'row',
      content: 'Row',
      data: {
        width: 'auto', height: 'auto', gap: '0', alignment: 'start', vAlignment: 'center',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0', startSpacing: '0', endSpacing: '0'
      },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
      icon: 'assets/row_N.svg'
    },
    {
      name: 'divider',
      content: 'Divider',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0', alignment: 'start', width: '1', height: '10',
        dividerColor: '#000000'
      },
      icon: 'assets/Line 45.svg'
    }
  ];

  // Page Elements
  draggableListLeftPE: DraggableItem[] = [
    {
      name: 'card',
      content: 'Card',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '20', pb: '20', pl: '20', pr: '20', imageAlignment: 'start', titleAlignment: 'start', descAlignment: 'start',
        width: '200', imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg', imageWidth: '100', title: ' Card title', desc: 'Card Description',
        fillColor: '#f1f3f6'
      },
      icon: 'assets/solar_card-2-outline.svg'
    }
  ];

  // List that is Visible on the canvas
  draggableListRight: DraggableItem[] = [
  ];

  formData: DataForm = {};

  virtualElementsExpand: boolean = true;
  layoutElementsExpand: boolean = true;
  pageElementsExpand: boolean = true;

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

  rightPanelExpanded: boolean = true;
  widgetTree: any[] = [];

  currentScreenView: string = 'assets/circum_mobile-1.png';// Mobile View
  mutiScreenView: boolean = false;
  loading: boolean = false;

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
    this.loading = true;
    this.formService.getData({ id: this.formId }).then((res: any) => {
      this.formData = res;
      if (res.formDefinition)
        this.draggableListRight = JSON.parse(res.formDefinition);
      this.widgetTree = this.draggableListRight;
      // console.log(this.draggableListRight);
      if (this.formData) {
        var filterStr = FilterBuilder.equal('collection.id', this.formData?.collection?.id!);
        this.fieldService.getAllData(undefined, filterStr).then((res: any) => {
          this.fields = res.content;
        });
        this.collectionService.getAllData().then((res: any) => {
          this.collections = res.content;
        })
      }
      this.loading = false;
    })

  }
  onDragged(item: any, list: any, effect: DropEffect) {
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
      // event.data['id'] = Math.floor(Math.random() * 1000000);
      // list.splice(index, 0, event.data);
      // this.activeItem = event.data;

      // Ensure event.data is an object and has no previous id
      if (event.data && typeof event.data === 'object') {
        const newItem = { ...event.data, id: Math.floor(Math.random() * 1000000) };
        list.splice(index, 0, newItem);
        this.activeItem = newItem;
      } else {
        console.error('Invalid data dropped:', event.data);
      }

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
    // Recursive function to find and delete the item
    const findAndDelete = (list: any[]): boolean => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === this.activeItem.id) {
          list.splice(i, 1);
          this.activeItem = null;
          return true;
        }
        if (list[i].children && Array.isArray(list[i].children)) {
          if (findAndDelete(list[i].children)) {
            return true;
          }
        }
      }
      return false;
    };

    // Start the search and deletion process
    if (!findAndDelete(this.draggableListRight)) {
      console.warn("Active item not found for deletion");
    }
  }

  handleClick(event: MouseEvent, item: any) {
    event.stopPropagation();
    console.log(item);
    console.log(item.name);
    this.activeItem = item;
  }

  onClickPickElement() {
    var newItem: any;
    this.activeItem = newItem;
  }

  isExpanded: boolean = false;

  toggle(item: any): void {
    if (this.hasChildren(item)) {
      this.isExpanded = !this.isExpanded;
    }
  }

  hasChildren(item: any): boolean {
    return item.children && item.children.length > 0;
  }

  getBackgroundColor() {
    return this.mutiScreenView == false ? '#e7ecfd' : '#C7D2FE';
  }

  changeScreen(screenURL: string) {
    this.currentScreenView = screenURL;
    this.mutiScreenView = false;
  }

  onItemReceived(item: any) {
    this.activeItem = item;
    console.log('Item received from child:', item);
  }

  searchValue: string = '';
  filteredDraggableListLeftVE: DraggableItem[] = [...this.draggableListLeftVE];
  filteredDraggableListLeftLE: DraggableItem[] = [...this.draggableListLeftLE];
  filteredDraggableListLeftPE: DraggableItem[] = [...this.draggableListLeftPE];

  onSearchValueChange(value: any) {
    this.searchValue = value;
    this.filterLists();
  }

  filterLists() {
    if (this.searchValue.trim() === '') {
      this.filteredDraggableListLeftVE = [...this.draggableListLeftVE];
      this.filteredDraggableListLeftLE = [...this.draggableListLeftLE];
      this.filteredDraggableListLeftPE = [...this.draggableListLeftPE];
    } else {
      this.filteredDraggableListLeftVE = this.filterList(this.draggableListLeftVE);
      this.filteredDraggableListLeftLE = this.filterList(this.draggableListLeftLE);
      this.filteredDraggableListLeftPE = this.filterList(this.draggableListLeftPE);
    }
  }


  filterList(list: DraggableItem[]): DraggableItem[] {
    return list.filter(item =>
      item.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  getList(originalList: DraggableItem[], filteredList: DraggableItem[]): DraggableItem[] {
    return this.searchValue.trim() === '' ? originalList : filteredList;
  }

}
