import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { MediaService } from '../../media-manager/media.service';
import { Asset, Folder } from '../../media-manager/folder';
import { LayoutService } from '../../layout/layout.service';

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

  @ViewChild('PagePreviewComponent', { static: false }) PagePreviewComponent !: ElementRef;

  form!: FormGroup<any>;
  data: Screen[] = [];
  componentName: string = 'Screen';

  loading: boolean = false;
  visibleDeleteConfirmation: boolean = false;
  currListView: boolean = true;
  activeData: any;
  selectAssetModel: boolean = false;
  imageURL!: any;

  allFolders: Folder[] = [];
  allAssets: Asset[] = [];

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
        label: 'Input Label', placeholder: 'Placeholder', labelFont: '14', labelWeight: '400', labelColor: '#000000',fontSize: '14', fontWeight: '400', fontColor: '#000000', fieldHeight: '35', fieldRadius: '4', bgColor: '#f1f3f6', borderColor: '#f1f3f6', borderWidth: '1',
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
        label: 'Input Label', placeholder: 'Placeholder', labelFont: '14', labelWeight: '400', labelColor: '#000000', fieldHeight: '35', fieldRadius: '4', bgColor: '#f1f3f6', borderColor: '#f1f3f6', borderWidth: '1',
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
        label: 'Input Label', placeholder: 'Placeholder', labelFont: '14', labelWeight: '400', labelColor: '#000000', fieldHeight: '50', bgColor: '#f1f3f6', borderColor: '#f1f3f6', borderWidth: '1', borderRadius: '4',
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
        text: 'Input Label', fontSize: '12', fontWeight: '600', fontColor: '#4338ca',
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
        width: 'auto', height: 'auto', alignment: 'center', vAlignment: 'center', gap: '0',
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
        bgcolor: '#000000'
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
        bgColor: '#f1f3f6'
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
  searchQuery: string = '';

  collectionItems: Collection[] = [];
  collection: Collection = {};
  microserviceItems: MicroService[] = [];
  applicationItems: Application[] = [];
  currentApplication : Application = {}  ;

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
    private applicationService: ApplicationService,
    private renderer: Renderer2, private el: ElementRef,
    private mediaService: MediaService,
    private layoutService : LayoutService
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
    this.layoutService.checkPadding(false);

    this.applicationService.getActiveApplication().subscribe((val:any) => {
      this.currentApplication = val ;
    });

    this.updateChildStyles();
    this.getPageData();
  }

  getPageData() {
    this.loading = true;
    this.getAllDataById(this.currentApplication.id);
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

  getDataSorted() {
    return this.data.sort((a: any, b: any) => a.screenName.localeCompare(b.screenName));
  }

  override editData(ds: any): void {
    super.editData(ds);
    this.getCollectionItems();
  }

  deleteThisPage(item: any) {

    this.activeItem = null;
    this.screenId = null;
    this.router.navigate(['/builder/screens/designer/' + null]);
    this.deleteDataByApplication(item , this.currentApplication.id);
    this.activeItem = null;
    this.screenId = null;
    this.router.navigate(['/builder/screens/designer/' + null]);
    this.activeData = null;
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
    if (this.screenId !== 'null') {
      this.screenService.getData({ id: this.screenId }).then((res: any) => {
        // console.log(res);
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
      this.loading = false;
    }
    this.activeItem = null;
  }

  openNewPage(scr: any) {
    this.loading = true;
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

  pasteThisPageInside(afterObjectId: string) {
    this.copiedResult = localStorage.getItem('componentPage');
    this.copiedList = JSON.parse(this.copiedResult);
    this.copiedList = this.assignUniqueIds(this.copiedList);

    const found = this.insertAfterId(this.draggableListRight, afterObjectId, this.copiedList);

    if (!found) {
      this.draggableListRight = [...this.draggableListRight, ...this.copiedList];
    }

    this.widgetTree = this.draggableListRight;
    this.messageService.add({ severity: 'success', summary: 'Paste', detail: 'Content pasted successfully.' });
    localStorage.removeItem('componentPage');
  }

  // Recursive function to find and insert copied list after specific ID
  insertAfterId(list: any[], afterObjectId: string, copiedList: any[]): boolean {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === afterObjectId) {
        list.splice(i + 1, 0, ...copiedList);
        return true;
      } else if (list[i].children && list[i].children.length > 0) {
        const found = this.insertAfterId(list[i].children, afterObjectId, copiedList);
        if (found) {
          return true;
        }
      }
    }
    return false;
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

  onItemReceivedPaste(item: any) {
    console.log(item);
    this.pasteThisPageInside(item.id);
  }

  duplicateObj: any;

  duplicateData(ds: any) {
    // Duplicate component must have different id and form name
    this.visible = true;
    this.duplicateObj = {
      'id': '',
      'screenName': '',
      'screenCode': ds.screenCode,
      'screenDescription': ds.screenDescription,
      'screenDefinition': ds.screenDefinition,
      'collection': ds.collection,
      'microService': ds.microService,
      'application': ds.application,
      'process': ds.process
    }

    this.form.patchValue({ ...this.duplicateObj });
  }

  confirmToDelete(item: any) {
    this.activeData = item;
    this.visibleDeleteConfirmation = true;
  }

  deleteConfirmed() {
    this.deleteThisPage(this.activeData);
  }

  // Old blob preview code
  // downloadDivHTML() {
  //   if (!this.screenId) {
  //     this.msgService.add({ severity: 'info', summary: 'Info', detail: 'No Page Found.' });
  //     return;
  //   }

  //   const div = this.el.nativeElement.querySelector('#downloadable-div');
  //   if (div == null) {
  //     this.msgService.add({ severity: 'info', summary: 'Info', detail: 'No Preview available for an empty page.' });
  //     return;
  //   }

  //   // Clone the content to manipulate it without affecting the original
  //   const clonedDiv = div.cloneNode(true) as HTMLElement;

  //   // Remove the 'giveBorder' class from all elements
  //   clonedDiv.querySelectorAll('.borderOutline').forEach(element => {
  //     element.classList.remove('borderOutline');
  //   });

  //   const htmlContent = clonedDiv.innerHTML;

  //   // Collect all stylesheets from the current document
  //   const stylesheets = Array.from(document.styleSheets)
  //     .map((styleSheet: CSSStyleSheet) => {
  //       if (styleSheet.href) {
  //         return `<link rel="stylesheet" type="text/css" href="${styleSheet.href}">`;
  //       } else {
  //         try {
  //           const rules = Array.from(styleSheet.cssRules)
  //             .map(rule => rule.cssText)
  //             .join('');
  //           return `<style>${rules}</style>`;
  //         } catch (e) {
  //           console.warn('Cannot access stylesheet', styleSheet.href);
  //           return '';
  //         }
  //       }
  //     })
  //     .join('');

  //   // Creating a HTML document with no text selection or pointer events on non-interactive elements
  //   const fullHTML = `
  //     <html>
  //       <head>
  //         <title>Preview</title>
  //         ${stylesheets}
  //         <style>
  //           body {
  //             user-select: none; /* Prevent text selection */
  //           }
  //           input, select, textarea, button, a, video, dropdown, checkbox, label, .combo-wrapper, .combo-item {
  //             pointer-events: auto; /* Enable pointer events for interactive elements */
  //             user-select: auto; /* Allow text selection within input fields and other interactive elements */
  //           }
  //           .non-interactive {
  //             pointer-events: none; /* Disable pointer events for non-interactive elements */
  //           }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="non-interactive">
  //           ${htmlContent}
  //         </div>
  //       </body>
  //     </html>
  //   `;

  //   const blob = new Blob([fullHTML], { type: 'text/html' });
  //   const url = window.URL.createObjectURL(blob);
  //   window.open(url, '_blank');

  //   // Release the object URL if needed
  //   window.URL.revokeObjectURL(url);
  // }

  // New Preview Code
  previewInWeb() 
  {
    const manContent = document.querySelector('app-page-preview')?.innerHTML;
    const manStyles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules || [])
            .map((rule) => rule.cssText)
            .join('');
        } catch (e) {
          console.warn('Could not read stylesheet:', sheet, e);
          return '';
        }
      })
      .join('');

    const newTab = window.open('', 'preview');
    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <style>${manStyles}</style>
          </head>
          <body>${manContent}</body>
        </html>
      `);
      newTab.document.close();
    } else {
      console.error('Failed to open new tab');
    }
  }

  openMobilePreview() {
    if (!this.screenId) {
      this.msgService.add({ severity: 'info', summary: 'Info', detail: 'No Page Found.' });
      return;
    }
    const div = this.el.nativeElement.querySelector('#downloadable-div');
    if (div == null) {
      this.msgService.add({ severity: 'info', summary: 'Info', detail: 'No Preview available for an empty page.' });
      return;
    }
    this.router.navigate(['/builder/mobile-preview']);
  }

  currentPage: any;
  hoverPage(action: string, page: any) {
    if (action == 'enter') {
      this.currentPage = page;
    }
    else {
      this.currentPage = null;
    }
  }

  checkImageModelClicked(isClicked: boolean) {
    this.selectAssetModel = isClicked;
    this.getAllFolders();
  }

  getAllFolders() {
    this.loading = true;
    this.mediaService.getAllFolders().then(
      (res: any) => {
        if (res) {
          this.allFolders = res.content;
          this.getAssetsGlobal();
        }
        else {
          this.loading = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Error while fetching the folders.',
            life: 3000,
          });
        }
      }
    ).catch((err: any) => {
      this.loading = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: err.error.message,
        life: 3000,
      });
    })
  }

  getAssetsGlobal() {
    let index: number;
    for (index = 0; index < this.allFolders.length; index++) {

      this.mediaService.getAssetsByFolderId(this.allFolders[index]?.id).then(
        (res: any) => {
          if (res) {
            this.allAssets = [...this.allAssets, ...res];
          }
          else {
            this.loading = false;
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Error while fetching the Assets.',
              life: 3000,
            });
          }
        }
      );
    }
    this.loading = false;
  }

  filteredAssets: Asset[] = [];
  searchAssets() {
    if (this.searchQuery) {
      this.filteredAssets = this.allAssets.filter(asset =>
        asset.fileName?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    else {
      this.filteredAssets = this.allAssets;
    }
  }

  getAssetList() {
    return this.searchQuery ? this.filteredAssets : this.allAssets;
  }

  sendThisAsset(asset: any) {
    this.imageURL = asset.url;
    this.selectAssetModel = false;
    console.log(this.imageURL);
  }

}