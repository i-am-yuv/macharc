import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DndDropEvent, DropEffect, EffectAllowed } from 'ngx-drag-drop';
import { ScreenService } from '../screen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Screen } from '../screen';
import { FieldService } from '../../fields/field.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { Field } from '../../fields/field';
import { MessageService } from '@splenta/vezo/src/public-api';
import { Collection } from '../../collection/collection';
import { CollectionService } from '../../collection/collection.service';
import { DataFormService } from '../../data-form/data-form.service';
import { DataForm } from '../../data-form/data-form';
import { GenericComponent } from '../../utils/genericcomponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MicroService } from '../../microservice/microservice';
import { Application } from '../../application/application';
import { MicroserviceService } from '../../microservice/microservice.service';
import { ApplicationService } from '../../application/application.service';

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
  mappedData?: any;
  children?: any[],
  icon?: any;
  id?: any;
}
@Component({
  selector: 'app-designer',
  templateUrl: './designer.component.html',
  styleUrls: ['./designer.component.scss']
})
export class DesignerComponent extends GenericComponent implements OnInit {
  form!: FormGroup<any>;
  data: Screen[] = [];
  componentName: string = 'Screen';

  loading: boolean = false;
  visibleDeleteConfirmation : boolean = false ;
  activeData : any ;

  // Virtual Elements
  draggableListLeftVE: DraggableItem[] = [
    {
      name: 'heading',
      content: 'Text',
      data: {
        text: 'Text', fontSize: '14', fontWeight: '400', fontColor: '#000000', alignment: 'start', vAlignment: 'start',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      mappedData: {},
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
      mappedData: {}, // this will consist of the data that is mapped 
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
      },
      mappedData: {},
      icon: 'assets/button.svg'
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
      },
      mappedData: {},
      icon: 'assets/textField.svg'
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
      mappedData: {},
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
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0', alignment: 'start'
      },
      mappedData: {},
      icon: 'assets/checkBox.svg'
    },
    {
      name: 'radio',
      content: 'Radio',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        label: 'Input Label', labelFont: '14', labelWeight: '400', labelColor: '#000000', alignment: 'start',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      mappedData: {},
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
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0', alignment: 'start'
      },
      mappedData: {},
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
      mappedData: {},
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
      mappedData: {},
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
      mappedData: {},
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
        , shadow: 'none'
      },
      mappedData: {},
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
      mappedData: {},
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
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      mappedData: {},
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
      icon: 'assets/row_N.svg'
    },
    {
      name: 'column',
      content: 'Column',
      data: {
        width: 'auto', height: 'auto', alignment: 'center', hAlignment: 'center', gap: '0',
        mt: '0', mb: '0', ml: '0', mr: '0', pt: '0', pb: '0', pl: '0', pr: '0'
      },
      mappedData: {},
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
      icon: 'assets/columnIcon.svg'
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
      mappedData: {},
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

  collectionId: string | null | undefined = '';
  collectionItems: Collection[] = [];
  collection: Collection = {};
  microserviceItems: MicroService[] = [];
  applicationItems: Application[] = [];

  constructor(
    private screenService: ScreenService,
    messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private fieldService: FieldService,
    private collectionService: CollectionService,
    private formsService: DataFormService,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private microserviceService: MicroserviceService,
    private applicationService: ApplicationService
  ) {
    super(screenService, messageService);
    this.form = this.fb.group({
      id: '',
      screenName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      screenCode: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      screenDescription: [],
      screenDefinition: [],
      collection: [],
      microService: [],
      application: [],
      process: [],
    })
  }
  public ngOnInit() {
    this.updateChildStyles();
    this.getPageData();
  }

  getPageData() {
    this.loading = true;
    this.getAllData();
    this.loading = false;

    this.microserviceService.getAllData().then((res: any) => {
      if (res) {
        this.microserviceItems = res.content;
      }
    })
    this.applicationService.getAllData().then((res: any) => {
      if (res) {
        this.applicationItems = res.content;
      }
    })

    this.getPageContent();
  }

  override editData(ds: any): void {
    super.editData(ds);
    this.getCollectionItems();
  }

  deleteThisPage(item: any) {

    this.activeItem = null;
    this.screenId = null;
    this.router.navigate(['/builder/screens/designer/' + null]);
    this.deleteData(item);
    this.activeItem = null;
    this.screenId = null;
    this.router.navigate(['/builder/screens/designer/' + null]);
    this.activeData = null ;
    this.visibleDeleteConfirmation = false;
  }

  getCollectionItems() {
    // this.form.patchValue({ collection: null });
    var filterStr = FilterBuilder.equal('microService.id', this.form.value.microService.id);
    this.collectionService.getAllData(undefined, filterStr).then((res: any) => {
      if (res) {
        this.collectionItems = res.content;
      }
    })
  }

  getPageContent() {
    this.loading = true;
    this.screenId = this.route.snapshot.paramMap.get('id');
    // alert(this.screenId ) ;
    if (this.screenId !== null) {
      this.screenService.getData({ id: this.screenId }).then((res: any) => {
        console.log(res);
        this.screenData = res;
        if (res.screenDefinition) {
          this.draggableListRight = JSON.parse(res.screenDefinition);
          this.widgetTree = this.draggableListRight;
        }
        else {
          this.draggableListRight = [];
          this.widgetTree = this.draggableListRight;
        }
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
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        console.error('Error fetching data:', error);
        this.activeItem = null;
        this.screenId = null;
        this.router.navigate(['/builder/screens/designer/' + null])
      });
    }
    else {
      this.activeItem = null;
      this.screenId = null;
      this.router.navigate(['/builder/screens/designer/' + null])
      console.log('no active page found');
    }
    this.activeItem = null;
  }

  openNewPage(scr: any) {
    this.router.navigate(['/builder/screens/designer/' + scr.id]);
    setTimeout(() => {
      this.getPageContent();
    }, 1000);
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

  changeScreen(screenURL: string, screenName: string) {
    this.currentScreenView = screenURL;
    this.mutiScreenView = false;
    if (screenName == 'mobile') {
      this.childWidth = 360;
    }
    else if (screenName == 'tablet') {
      this.childWidth = 1024;


    } else if (screenName == 'desktop') {
      this.childWidth = 1440;
    }
    this.resetZoom();
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
      item.content.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  getList(originalList: DraggableItem[], filteredList: DraggableItem[]): DraggableItem[] {
    return this.searchValue.trim() === '' ? originalList : filteredList;
  }

  //---------- Zoom and Screen Resize code from here -------------------//
  @ViewChild('parent') parent !: ElementRef;

  //childHeight = 500;
  childWidth = 700; // giving default width as 700 to our component
  zoom = 0.3;

  get childStyles() {
    return {
      // height: `${this.childHeight}px`,
      // height:'auto'+50,
      width: `${this.childWidth ? this.childWidth : 700}px`,
      transform: `scale(${this.zoom})`,
      transformOrigin: 'top center'
    };
  }

  zoomIn() {
    this.zoom = Math.min(this.zoom + 0.1, 3); // Maximum zoom level can be enable by user is given 300%
    this.updateChildStyles();
  }

  zoomOut() {
    this.zoom = Math.max(this.zoom - 0.1, 0.1); // Minimum zoom level can be enable by user is given 10%
    this.updateChildStyles();
  }

  resetZoom() {
    this.zoom = 0.3;
    this.updateChildStyles();
  }

  updateChildStyles() {
    if (this.parent) {
      this.parent.nativeElement.scrollTo(0, 0); // Resetting   scroll position to top-left
    }
  }


  // Code for copy Page ---------------------------------------------------
  // List that is Visible on the canvas
  copiedCanvas: DraggableItem[] = [
  ];

  copyThisPage(oldList: any) {
    this.copiedCanvas = oldList;
    var copiedContent = JSON.stringify(this.copiedCanvas);
    localStorage.setItem('componentPage', copiedContent);
    this.msgService.add({ severity: 'success', summary: 'Copied', detail: 'Content Copied successfully.' });
  }

  checkPageAvailable() {
    if (localStorage.getItem('componentPage') != null) {
      return true;
    }
    else {
      return false;
    }
  }

  copiedResult: any;
  copiedList: any;
  pasteThisPage() {
    this.copiedResult = localStorage.getItem('componentPage');

    this.copiedList = JSON.parse(this.copiedResult);

    this.copiedList = this.assignUniqueIds(this.copiedList);

    this.draggableListRight = [...this.draggableListRight, ...this.copiedList];
    this.widgetTree = this.draggableListRight;

    // console.log('after pasting');
    this.msgService.add({ severity: 'success', summary: 'Paste', detail: 'Content pasted successfully.' });
    localStorage.removeItem('componentPage'); // Removing this for temporary purpose
  }

  // Method to assign unique IDs recursively
  assignUniqueIds(list: any[]): any[] {
    return list.map(item => {
      const newItem = { ...item, id: this.generateUniqueId() };
      if (newItem.children && newItem.children.length > 0) {
        newItem.children = this.assignUniqueIds(newItem.children);
      }
      return newItem;
    });
  }

  // Method to generate a unique ID
  generateUniqueId(): number {
    return Math.floor(Math.random() * 100000) + 1;
  }

  copySubList: any[] = []; // Initialize the list as empty
  onItemReceivedCopy(item: any) {
    //this.activeItem = item;
    console.log(item);
    const newItem = { ...item, id: this.generateUniqueId() };

    this.copySubList = [];
    this.copySubList.push(newItem);
    this.copyThisPage(this.copySubList);
  }

  // Code for duplicating the page with different name
  duplicateData(ds: any) {
    this.visible = true;
    // Duplicate component must have different id and form name
    ds.id = '';
    ds.screenName = '';
    this.form.patchValue({ ...ds });
  }

  confirmToDelete(item : any)
  {
      this.activeData = item ;
      this.visibleDeleteConfirmation = true ;
  }

  deleteConfirmed()
  {
      this.deleteThisPage(this.activeData) ;
  }

}