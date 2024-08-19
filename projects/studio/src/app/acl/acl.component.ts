import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { Collection } from '../collection/collection';
import { CollectionService } from '../collection/collection.service';
import { FieldService } from '../fields/field.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericComponent } from '../utils/genericcomponent';

@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.scss'],
})
export class AclComponent extends GenericComponent implements OnInit {
  form: FormGroup<any>;
  data: any[] = [];
  componentName: string = 'Acl';

  collection: Collection = {};
  dataTypes: any[] = [
    { label: 'Unprivileged', value: 'Unprivileged' },
    { label: 'Authorized', value: 'Authorized' },
    { label: 'System', value: 'System' },
  ];
  collectionId: string | null;

  showForm: boolean = false;
  collections: Collection[] = [];
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

    this.form = this.fb.group({
      id: '',
      fieldName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      dataType: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      collection: this.fb.group({
        id: this.collectionId,
      }),
    });
  }
  override preSave(): void {
    this.form.patchValue({ collection: { id: this.collectionId } });
  }
  ngOnInit(): void {
    this.data = [
      { role: 'IT User', endpoint: 'GetAll', block: false },
      { role: 'IT Approver', endpoint: 'GetOn', block: false },
      { role: 'CFM User', endpoint: 'Create', block: false },
      { role: 'CFM Approver', endpoint: 'Read', block: false },
      { role: 'CFM Approver', endpoint: 'Update', block: false },
      { role: 'CFM Approver', endpoint: 'Delete', block: false },
    ];

    this.collectionService.getAllData().then((res) => {
      this.collections = res.content;
      this.collection = this.collections[0];
    });

    if (this.collectionId) {
      var filterStr = FilterBuilder.equal('collection.id', this.collectionId);
      this.search = filterStr;
      this.getAllData();
      this.collectionService.getData({ id: this.collectionId }).then((res) => {
        this.collection = res;
      });
    }
  }
}
