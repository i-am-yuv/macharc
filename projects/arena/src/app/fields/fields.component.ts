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
    { label: 'Required', value: 'Required' },
    { label: 'NotNull', value: 'NotNull' },
    { label: 'NotBlank', value: 'NotBlank' },
    { label: 'Min', value: 'Min' },
    { label: 'Max', value: 'Max' },
    { label: 'Size', value: 'Size' },
    { label: 'Email', value: 'Email' },
    { label: 'Valid', value: 'Valid' },
    { label: 'DecimalMin', value: 'DecimalMin' },
    { label: 'DecimalMax', value: 'DecimalMax' },
    { label: 'Alpha', value: 'Alpha' },
    { label: 'AlphaNumeric', value: 'AlphaNumeric' },
    { label: 'Numbers Only', value: 'Numeric' },
    { label: 'Pattern', value: 'Pattern' },
  ];
  collectionId: string | null;

  showForm: boolean = false;
  fieldType: string = 'String';
  collections: any[] = [];

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
      fieldName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      dataType: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      fieldType: [''],
      validation: [''],
      pattern: [''],
      minlength: [''],
      maxlength: [''],
      collection: [],
      foreignKey: [],
    });
  }
  isMinEnabled: boolean = false;
  isMaxEnabled: boolean = false;
  isPatternEnabled: boolean = false;
  displayTextField(selectedValue: any) {
    if (selectedValue === 'Min') {
      // alert(selectedValue);
      this.isMinEnabled = true;
      this.isMaxEnabled = false;
      this.isPatternEnabled = false;
    } else if (selectedValue === 'Max') {
      this.isMaxEnabled = true;
      this.isMinEnabled = false;
      this.isPatternEnabled = false;
    } else if (selectedValue === 'Pattern') {
      this.isPatternEnabled = true;
      this.isMaxEnabled = false;
      this.isMinEnabled = false;
    } else {
      this.isPatternEnabled = false;
      this.isMaxEnabled = false;
      this.isMinEnabled = false;
    }
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
      });
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
            detail: 'All apis created',
          });
          this.getAllData();
        });
    }
  }

  setFieldType(ft: string) {
    this.fieldType = ft;
    this.form.patchValue({ fieldType: ft });
  }
}
