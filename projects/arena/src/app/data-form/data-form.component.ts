import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { Collection } from '../collection/collection';
import { CollectionService } from '../collection/collection.service';
import { MicroService } from '../microservice/microservice';
import { MicroserviceService } from '../microservice/microservice.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { DataForm } from './data-form';
import { DataFormService } from './data-form.service';
import { GenericComponent } from '../utils/genericcomponent';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss']
})
export class DataFormComponent extends GenericComponent {

  form!: FormGroup<any>;
  data: DataForm[] = [];
  componentName: string = 'DataForm';
  collectionId: string | null | undefined = '';
  collectionItems: Collection[] = [];
  collection: Collection = {};
  microserviceItems: MicroService[] = [];
  override pageData = {};

  constructor(
    private fb: FormBuilder,
    formService: DataFormService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private microserviceService: MicroserviceService,
  ) {
    super(formService, messageService);
    this.form = this.fb.group({
      id: '',
      formName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      formCode: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      formDescription: [],
      collection: [],
      microService: [],
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
    this.router.navigate(['/builder/forms/designer/' + scr.id]);
  }

}
