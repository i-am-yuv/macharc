import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DndDropEvent, DropEffect, EffectAllowed } from 'ngx-drag-drop';
import { ScreenService } from '../screen.service';
import { ActivatedRoute } from '@angular/router';
import { Screen } from '../screen';
import { FieldService } from '../../fields/field.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { Field } from '../../fields/field';
import { MessageService } from '@splenta/vezo';
import { Collection } from '../../collection/collection';
import { CollectionService } from '../../collection/collection.service';
import { DataFormService } from '../../data-form/data-form.service';
import { DataForm } from '../../data-form/data-form';

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
  children?: any[],
  icon?: any;
  id?: any;
}
@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent implements OnInit {

  loading: boolean = false;

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
      , icon: 'assets/button.svg'
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
      , icon: 'assets/textField.svg'
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
      icon: 'assets/checkBox.svg'

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
    },
    {
      name: 'accordion',
      content: 'Accordion',
      data: {},
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
      icon: 'assets/textField.svg'
    },
    {
      name: 'form',
      content: 'Component',
      data: { formName: 'none', formId: '' },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
      icon: 'assets/bitcoin-icons_grid-outline.svg'
    },
    {
      name: 'table',
      content: 'Table',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        actions: [{
          label: 'Edit',
          icon: 'pencil'
        }, {
          label: 'Delete',
          icon: 'trash'
        }],
        caption: 'Table Heading',
        cols: [
          {
            heading: 'Code',
            field: 'code',
            sortable: true,
            filterable: true
          }, {
            heading: 'Name',
            field: 'name',
            sortable: true,
            filterable: true
          }],
        rows: [{
          code: 1,
          name: 'Name 1'
        }, {
          code: 2,
          name: 'Name 2'
        }, {
          code: 3,
          name: 'Name 3'
        }]
      },
      icon: 'assets/Line 45.svg'
    }
  ];

  // Layout Elements
  draggableListLeftLE: DraggableItem[] = [
    {
      name: 'container',
      content: 'Container',
      data: {
        width: '100', height: '100', bgColor: '#f1f3f6', gap: '0', columns: '2', alignment: 'start', vAlignment: 'center',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0', bgImage: '', borderWidth: '0', borderColor: '#FFFFFF', borderRadius: '0'
      },
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
      icon: 'assets/button.svg'
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


  draggableListRight: DraggableItem[] = [
  ];

  screenData: Screen = {};
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
  screenId: string | null = '';
  fields: Field[] = [];
  collections: Collection[] = [];
  forms: DataForm[] = [];
  rightPanelExpanded: boolean = true;
  widgetTree: any[] = [];

  currentScreenView: string = 'assets/circum_mobile-1.png';// Mobile View
  mutiScreenView: boolean = false;
  //loading: boolean = false;

  constructor(
    private screenService: ScreenService,
    private fieldService: FieldService,
    private collectionService: CollectionService,
    private formsService: DataFormService,
    private route: ActivatedRoute,
    private msgService: MessageService
  ) {

  }
  public ngOnInit() {
    this.screenId = this.route.snapshot.paramMap.get('id');
    this.screenService.getData({ id: this.screenId }).then((res: any) => {
      console.log(res);
      this.screenData = res;
      if (res.screenDefinition)
        this.draggableListRight = JSON.parse(res.screenDefinition);
      this.widgetTree = this.draggableListRight;
      if (this.screenData) {
        var filterStr = FilterBuilder.equal('collection.id', this.screenData?.collection?.id!);
        this.fieldService.getAllData(undefined, filterStr).then((res: any) => {
          this.fields = res.content;
        });
        this.collectionService.getAllData().then((res: any) => {
          this.collections = res.content;
        });
        this.formsService.getAllData().then((res: any) => {
          this.forms = res.content;
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
    this.screenData.screenDefinition = JSON.stringify(this.draggableListRight);
    this.screenService.updateData(this.screenData).then((res: any) => {
      this.msgService.add({ severity: 'success', summary: 'Updated', detail: 'Definition updated' });
    })
  }

  generateComponent() {
    this.loading = true;
    this.screenService.generateComponent(this.screenData).then((res: any) => {
      this.loading = false;
      this.msgService.add({ severity: 'success', summary: 'Generated', detail: 'Code Generated' });
    }).catch(e => {
      this.msgService.add({ severity: 'error', summary: 'Error Generating', detail: 'Sorry, there was an error generating the screen' });
      this.loading = false;
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
    console.log(event);
    console.log(item);
    this.activeItem = item;
  }
  handleClickForm(event: MouseEvent, child: any, item: any) {
    event.stopPropagation();
    console.log(item);
    this.activeItem = item;
  }

  getFields(collectionId: string) {
    var filterStr = FilterBuilder.equal('collection.id', collectionId);
    this.fieldService.getAllData(undefined, filterStr).then((res: any) => {
      this.fields = res.content;
    });
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