import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
import { Collection } from '../collection/collection';
import { CollectionService } from '../collection/collection.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericComponent } from '../utils/genericcomponent';
import { Field } from './field';
import { FieldService } from './field.service';

export interface dtoPayloadItem {
  id?: string;
};

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss']
})
export class FieldsComponent extends GenericComponent implements OnInit {


  form: FormGroup<any>;
  data: Field[] = [];
  componentName: string = 'Field';
  collection: Collection = {};
  dataTypes: any[] = [
    { label: 'String', value: 'String' },
    { label: 'Integer', value: 'int' },
    { label: 'Date', value: 'Date' },
    { label: 'Decimal', value: 'BigDecimal' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Foreign Key', value: 'fk' },
  ];

  validations: any[] = [
    { label: 'Required', value: 'REQUIRED' },
    { label: 'Alpha', value: 'Alpha' },
    { label: 'AlphaNumeric', value: 'AlphaNumeric' },
    { label: 'Email', value: 'Email' },
    { label: 'Numbers Only', value: 'Numeric' },
    { label: 'Pattern', value: 'Pattern' },
  ];
  collectionId: string | null;

  showForm: boolean = false;
  fieldType: string = 'String';
  collections: any[] = [];
  showGenerateDtoModel: boolean = false;

  dtoSelectedFields: [] = [];

  constructor(
    private fb: FormBuilder,
    fieldService: FieldService,
    private collectionService: CollectionService,
    private msgService: MessageService,
    messageService: MessageService,
    private route: ActivatedRoute
  ) {
    super(fieldService, messageService);
    this.collectionId = this.route.snapshot.paramMap.get('id');
    // console.log(this.collectionId);
    this.form = this.fb.group({
      id: '',
      fieldName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      dataType: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      fieldType: [''],
      validation: [''],
      pattern: [''],
      collection: [],
      foreignKey: []
    })
  }
  override preSave(): void {
    this.form.patchValue({ collection: { id: this.collectionId } });
    this.fieldType = '';
  }
  ngOnInit(): void {
    if (this.collectionId) {
      var filterStr = FilterBuilder.equal('collection.id', this.collectionId);
      this.search = filterStr;
      this.getAllData();
      this.collectionService.getAllData().then((res: any) => {
        this.collections = res.content;
      })
      this.collectionService.getData({ id: this.collectionId }).then((res) => {
        this.collection = res;
      })
    }
  }

  generateFromTable() {
    if (this.collectionId) {
      this.collectionService.generateFromTable(this.collectionId).then((res: any) => {
        this.msgService.add({ severity: 'success', summary: 'Generated', detail: 'All fields imported and apis created' });
        this.getAllData();
      })
    }
  }

  generateCode() {
    if (this.collectionId) {
      this.collectionService.generateCode(this.collectionId).then((res: any) => {
        this.msgService.add({ severity: 'success', summary: 'Generated', detail: 'All apis created' });
        this.getAllData();
      })
    }
  }


  generateDTO() {
    if (this.collectionId) {
      var finalPayload: dtoPayloadItem[] = [];
      // Transforming the list for the correct payload format
      for (var i = 0; i < this.dtoSelectedFields.length; i++) {
        var tempObj: dtoPayloadItem = {};
        tempObj.id = this.dtoSelectedFields[i];
        finalPayload.push(tempObj);
      }
      // console.log( 'finalDTOPayload' ) ;
      // console.log( finalPayload) ;

      this.collectionService.generateDTO(this.collectionId, finalPayload).then((res: any) => {
        this.msgService.add({ severity: 'success', summary: 'Success', detail: 'DTO Generated' });
        this.getAllData();
        this.showGenerateDtoModel = false;
      }).catch(
        (err) => {
          console.log("Inside Error");
          this.msgService.add({ severity: 'success', summary: 'Success', detail: 'DTO Generated' });
          this.getAllData();
          this.showGenerateDtoModel = false;
        }
      )
    }
  }

  setFieldType(ft: string) {
    this.fieldType = ft;
    this.form.patchValue({ fieldType: ft });
  }
}
