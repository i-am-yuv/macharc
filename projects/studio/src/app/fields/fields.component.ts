import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { Collection } from '../collection/collection';
import { CollectionService } from '../collection/collection.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericComponent } from '../utils/genericcomponent';
import { Field } from './field';
import { FieldService } from './field.service';

export interface dtoPayloadItem {
  id?: string;
}

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.scss'],
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

  dtoTypes: any[] = [
    { label: 'Request DTO', value: 'RequestDTO' },
    { label: 'Response DTO', value: 'ResponseDTO' },
  ];
  currentDTO: any;

  dtoSelectedFieldsReq: Field[] = [];
  dtoSelectedFieldsRes: Field[] = [];

  dtoSelectedFields: [] = [];
  relationShipTypes: any[] = [
    'OneToMany',
    'ManyToOne',
    'OneToOne',
    'ManyToMany',
  ];
  microserviceId: string | undefined;

  constructor(
    private fb: FormBuilder,
    fieldService: FieldService,
    private collectionService: CollectionService,
    private msgService: MessageService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private fieldS: FieldService
  ) {
    super(fieldService, messageService);
    this.collectionId = this.route.snapshot.paramMap.get('id');

    this.form = this.fb.group({
      id: '',
      fieldName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      dataType: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      fieldType: [''],
      validation: [''],
      pattern: [''],
      collection: [],
      foreignKey: [],
      relationShipType: '',
    });
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
      });
      this.collectionService.getData({ id: this.collectionId }).then((res) => {
        this.collection = res;
        this.microserviceId = this.collection.microService?.id;
      });
      this.getDtodata();
    }
    this.setDefaultDTO();
  }

  setDefaultDTO() {
    if (this.dtoTypes.length > 0) {
      this.currentDTO = this.dtoTypes[0].value;
    }
  }

  generateFromTable() {
    if (this.collectionId) {
      this.collectionService
        .generateFromTable(this.collectionId)
        .then((res: any) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Generated',
            detail: 'All fields imported and apis created',
          });
          this.getAllData();
        });
    }
  }

  generateCode() {
    if (this.collectionId) {
      this.collectionService
        .generateCode(this.collectionId)
        .then((res: any) => {
          this.msgService.add({
            severity: 'success',
            summary: 'Generated',
            detail: 'Model Generated',
          });
          this.getAllData();
        });
    }
  }

  generateDTO() {
    if (this.currentDTO == 'ResponseDTO') {
      if (this.collectionId) {
        // alert('This is ResponseDTO') ;
        var finalPayload: dtoPayloadItem[] = [];
        // Transforming the list for the correct payload format
        for (var i = 0; i < this.dtoSelectedFieldsRes.length; i++) {
          // var tempObj: dtoPayloadItem = {};
          // tempObj.id = this.dtoSelectedFields[i];
          finalPayload.push(this.dtoSelectedFieldsRes[i]);
        }

        this.collectionService
          .generateResponseDTO(this.collectionId, finalPayload)
          .then((res: any) => {
            this.msgService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Response DTO Generated',
            });
            this.getAllData();
            this.showGenerateDtoModel = false;
          })
          .catch((err) => {
            console.log('Inside Error');
            console.log(err);
            if (err.error ) {
              this.msgService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong',
              });
              this.getAllData();
              this.showGenerateDtoModel = false;
            }

          });
      }
    } else if (this.currentDTO == 'RequestDTO') {
      if (this.collectionId) {
        // alert('This is RequestDTO') ;

        var finalPayload: dtoPayloadItem[] = [];
        // Transforming the list for the correct payload format
        for (var i = 0; i < this.dtoSelectedFieldsReq.length; i++) {
          // var tempObj: dtoPayloadItem = {};
          // tempObj.id = this.dtoSelectedFields[i];
          // finalPayload.push(tempObj);
          finalPayload.push(this.dtoSelectedFieldsReq[i]);

        }
        this.collectionService
          .generateRequestDTO(this.collectionId, finalPayload)
          .then((res: any) => {
            this.msgService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Request DTO Generated',
            });
            this.getAllData();

            this.showGenerateDtoModel = false;
          })
          .catch((err) => {
            this.msgService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Request DTO Generated',
            });
            this.getAllData();
            this.showGenerateDtoModel = false;
          });
      }
    }
  }

  setFieldType(ft: string) {
    this.fieldType = ft;
    this.form.patchValue({ fieldType: ft });
  }

  getDtodata() {
    if (this.collection) {
      this.collectionService.getReqDto(this.collectionId)
        .then((res: any) => {
          if (res && res?.fields) {
            console.log('dto fields');
            console.log(res);
            this.dtoSelectedFieldsReq = res.fields;
          }
        });

      this.collectionService.getResDto(this.collectionId)
        .then((res: any) => {
          if ( res && res?.fields) {
            console.log('dto fields');
            console.log(res);
            this.dtoSelectedFieldsRes = res.fields;
          }
        });
    }
  }
}
