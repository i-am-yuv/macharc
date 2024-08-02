import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Pagination } from '@splenta/vezo/src/public-api';
import { MicroserviceService } from '../microservice/microservice.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericComponent } from '../utils/genericcomponent';
import { Collection } from './collection';
import { CollectionService } from './collection.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent extends GenericComponent implements OnInit {
  form: FormGroup<any>;
  data: Collection[] = [];
  componentName: string = 'Collection';
  microService: any = {};
  microserviceItems: any[] = [];
  microserviceId: string | undefined | null;
  crud: boolean = false;

  override pageData = {};
  collectionTypeItems: any[] = [
    { value: 'CRUD', label: 'CRUD Collection' },
    { value: 'READONLY', label: 'Readonly Collection' },
    { value: 'POJO', label: 'POJO Collection' },
  ];
  constructor(
    private fb: FormBuilder,
    collectionService: CollectionService,
    messageService: MessageService,
    private msgService: MessageService,
    private collectService: CollectionService,
    private route: ActivatedRoute,
    private router: Router,
    private microserviceService: MicroserviceService
  ) {
    super(collectionService, messageService);
    this.form = this.fb.group({
      id: '',
      collectionName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      customTableName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      collectionKind: ['', Validators.required],
      crud: [],
      readonly: [],
      hasService: [],
      microService: ['', Validators.required],
      dataSource: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.microserviceId = this.route.snapshot.paramMap.get('id');
    if (this.microserviceId) {
      this.microserviceService
        .getData({ id: this.microserviceId })
        .then((res: any) => {
          this.microService = res;
          this.form.patchValue({ microservice: res });
        });
      var filterStr = FilterBuilder.equal(
        'microService.id',
        this.microserviceId
      );
      this.search = filterStr;
    }
    this.getAllData();
    var pagination: Pagination = { pageSize: 1000 };
    this.microserviceService.getAllData(pagination).then((res: any) => {
      if (res) {
        this.microserviceItems = res.content;
      }
    });
  }
  override preSave(): void {
    if (!this.form.value.microService) {
      this.form.patchValue({ microservice: this.microService });
    }
  }

  editFields(collection: Collection) {
    this.router.navigate(['/builder/fields/' + collection.id]);
  }
}
