import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { Application } from '../../application/application';
import { ApplicationService } from '../../application/application.service';
import { GenericComponent } from '../../utils/genericcomponent';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
})
export class PropertiesComponent extends GenericComponent implements OnChanges {
  form!: FormGroup<any>;
  data: [] = [];
  componentName: string = 'Screen';

  @Input() props: any = {};
  @Input() fields: any[] = [];
  @Input() collections: any[] = [];
  @Input() forms: any[] = [];
  @Input() comingFromForm: boolean = false;
  @Input() comingFromPage: boolean = false;

  @Input() ImageURL = null;

  actualImageReceived: any;

  selectAssetModel: boolean = false;

  @Output() getCollectionFields: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() assetModelOpen = new EventEmitter<boolean>();

  isReceivedUrlSameAsInput: boolean = false;

  currentApplication: Application = {};

  column: any = {};

  boxShawdowOptions: any = ['sm', 'md', 'lg', 'xl', '2xl', 'inner', 'none'];

  constructor(
    messageService: MessageService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private screenService: ScreenService,
    private applicationService: ApplicationService
  ) {
    super(screenService, messageService);
    this.ImageURL = null;
    this.actualImageReceived = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['ImageURL'] &&
      changes['ImageURL'].currentValue !== changes['ImageURL'].previousValue
    ) {
      this.actualImageReceived = changes['ImageURL'].currentValue;
      this.handleInputChange(this.actualImageReceived, 'url');
      this.cdRef.detectChanges(); // Manually trigger change detection
    } else {
      this.actualImageReceived = null;
      this.ImageURL = null;
    }

    this.applicationService.getActiveApplication().subscribe((val: any) => {
      this.currentApplication = val;
      this.getAllScreenByApplication();
    });
  }

  getAllScreenByApplication() {
    this.getAllDataById(this.currentApplication.id);
  }

  @Output() deleteProp = new EventEmitter<boolean>();
  validations: any[] = [
    'Required',
    'Alpha',
    'Alpha Numeric',
    'Numbers',
    'Password',
    'Email',
    'Telephone',
    'Pattern',
  ];
  formData: any;

  deleteProperty() {
    this.deleteProp.emit(true);
  }
  deleteColumn() {
    var indexToDelete = this.props.data.cols.findIndex(
      (t: any) => t.field === this.column.field
    );
    if (indexToDelete > 0) {
      this.props.data.cols.splice(indexToDelete, 1);
      this.column = {};
    }
  }
  addColumn() {
    var indexToUpdate = this.props.data.cols.findIndex(
      (t: any) => t.field === this.column.field
    );
    console.log(this.column);

    if (!this.column.heading) {
      this.messageService.add({
        severity: 'error',
        detail: 'Add a heading',
        summary: 'Error',
      });
      return;
    }

    if (indexToUpdate > 0) {
      this.props.data.cols[indexToUpdate] = this.column;
    } else {
      this.props.data.cols.push(this.column);
    }
    this.column = {};
  }

  newColumn() {
    this.column = {};
    this.props.data.cols.push(this.column);
  }

  setColumn(col: any) {
    this.column = col;
  }

  setForm() {
    this.props.children = JSON.parse(this.formData.formDefinition);
    this.props.data.formId = this.formData.id;
    this.props.data.formName = this.formData.formName;
    console.log(this.props.data);
  }
  getFields() {
    this.getCollectionFields.emit(this.props.data.collection.id);
  }

  findComponent(componentId: any) {
    this.router.navigate(['/builder/forms/designer/' + componentId]);
  }

  makeItMapped(item: any, element: any) {
    if (!item) {
      item = {}; // Initialize item if it's undefined
    }
    if (item.mappedData && item.mappedData[element] === '[isMapped]') {
      delete item.mappedData[element]; // Remove the key if it has the value '[isMapped]'
    } else {
      if (!item.mappedData) {
        item.mappedData = {}; // Initialize mappedData if it's undefined
      }
      item.mappedData[element] = '[isMapped]'; // Set the value
    }
    console.log(item);
  }

  // Function to handle changes to the ngModel
  handleInputChange(value: string, element: any): void {
    if (this.comingFromForm) {
      this.props.mappedData[element] = value;
      if (element == 'url' && this.actualImageReceived !== null) {
        this.props.mappedData[element] = this.actualImageReceived;
      }
    } else {
      this.props.data[element] = value;
      if (element == 'url' && this.actualImageReceived !== null) {
        this.props.data[element] = this.actualImageReceived;
      }
    }
  }

  getInputValue(element: any): string {
    if (this.comingFromForm == true) {
      return this.props.mappedData[element];
    } else {
      if (
        this.props.mappedData != null &&
        this.props.mappedData[element] != null
      ) {
        return this.props.mappedData[element];
      } else {
        return this.props.data[element];
      }
    }
  }

  removeDirectImage() {
    this.actualImageReceived = null;
    this.handleInputChange(
      'https://primefaces.org/cdn/primeng/images/galleria/galleria10.jpg',
      'url'
    );
  }

  // Function to handle changes to the ngModel of Selected Image from Asset
  handleInputChangeImage(event: any, element: any): void {
    // if (value !== this.ImageURL) {
    //   this.ImageURL = null;
    // }
    // else {
    //   if (this.comingFromForm) {
    //     this.props.mappedData[element] = value;
    //     if (element == 'url' && this.ImageURL !== null) {
    //       this.props.mappedData[element] = this.ImageURL;
    //     }
    //   } else {
    //     this.props.data[element] = value;
    //     if (element == 'url' && this.ImageURL !== null) {
    //       this.props.data[element] = this.ImageURL;
    //     }
    //   }
    // }
    //this.ImageURL = null ;
  }

  getDataFieldCount(props: any): number {
    return props && props.mappedData ? Object.keys(props.mappedData).length : 0;
  }

  chooseAssetClicked() {
    this.assetModelOpen.emit(true);
  }

  check(datatest: any) {
    console.log(datatest);
  }
}
