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
    { label: 'Decimal', value: 'BigDecimal' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Foreign Key', value: 'fk' },
  ];
  collectionId: string | null;

  showForm: boolean = false;

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
    console.log(this.collectionId);
    this.form = this.fb.group({
      id: '',
      fieldName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      dataType: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      collection: this.fb.group({
        id: this.collectionId
      })
    })
  }
  override preSave(): void {
    this.form.patchValue({ collection: { id: this.collectionId } });
  }
  ngOnInit(): void {
    if (this.collectionId) {
      var filterStr = FilterBuilder.equal('collection.id', this.collectionId);
      this.search = filterStr;
      this.getAllData();
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
}
