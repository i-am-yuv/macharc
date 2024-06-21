import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataForm } from '../data-form';
import { Collection } from '../../collection/collection';
import { MicroService } from '../../microservice/microservice';
import { Application } from '../../application/application';
import { DataFormService } from '../data-form.service';
import { MessageService } from '@splenta/vezo';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../collection/collection.service';
import { MicroserviceService } from '../../microservice/microservice.service';
import { ApplicationService } from '../../application/application.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { GenericComponent } from '../../utils/genericcomponent';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.scss']
})
export class MenuPanelComponent extends GenericComponent {
  form!: FormGroup<any>;
  data: DataForm[] = [];
  componentName: string = 'DataForm';
  collectionId: string | null | undefined = '';
  collectionItems: Collection[] = [];
  collection: Collection = {};
  microserviceItems: MicroService[] = [];
  applicationItems: Application[] = [];
  override pageData = {};

  constructor(
    private fb: FormBuilder,
    formService: DataFormService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private microserviceService: MicroserviceService,
    private applicationService: ApplicationService
  ) {
    super(formService, messageService);
    this.form = this.fb.group({
      id: '',
      formName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      formCode: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      formDescription: [],
      collection: [],
      microService: [],
      application: [],
      process: [],
    })
  }
  ngOnInit(): void {
    this.getAllData();
    this.collectionId = this.route.snapshot.paramMap.get('id');
    if (this.collectionId) {
      this.collectionService.getData({ id: this.collectionId }).then((res: any) => {
        this.collection = res;
        this.form.patchValue({ collection: res });
      })
    } else {
      this.microserviceService.getAllData().then((res: any) => {
        if (res) {
          this.microserviceItems = res.content;
        }
      })
    }
    this.applicationService.getAllData().then((res: any) => {
      if (res) {
        this.applicationItems = res.content;
      }
    })
  }
  getCollectionItems() {
    this.form.patchValue({ collection: null });
    var filterStr = FilterBuilder.equal('microService.id', this.form.value.microService.id);
    this.collectionService.getAllData(undefined, filterStr).then((res: any) => {
      if (res) {
        this.collectionItems = res.content;
      }
    })
  }
  saveFormData() {
    console.log(this.form.value);
  }


  override preSave(): void {
    console.log(this.form.value);
    if (!this.form.value.collection) {
      console.log('here');
      if (this.collection) {
        this.form.patchValue({ collection: this.collection });
      } else {
        console.log('no collection')
      }
    }
  }
  designDataForm(scr: DataForm) {
    this.router.navigate(['panelmenu/create']);
  }
}
