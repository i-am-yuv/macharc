import { Component, OnInit } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScreenService } from './screen.service';
import { Screen } from './screen';
import { MessageService } from '@splenta/vezo/src/public-api';
import { Collection } from '../collection/collection';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../collection/collection.service';
import { MicroserviceService } from '../microservice/microservice.service';
import { MicroService } from '../microservice/microservice';
import { FilterBuilder } from '../utils/FilterBuilder';
import { FieldService } from '../fields/field.service';
import { Application } from '../application/application';
import { ApplicationService } from '../application/application.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent extends GenericComponent implements OnInit {


  form!: FormGroup<any>;
  data: Screen[] = [];
  componentName: string = 'Screen';
  collectionId: string | null | undefined = '';
  collectionItems: Collection[] = [];
  collection: Collection = {};
  microserviceItems: MicroService[] = [];
  applicationItems: Application[] = [];
  override pageData = {};
  loading : boolean = false;

  constructor(
    private fb: FormBuilder,
    screenService: ScreenService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private fieldService: FieldService,
    private microserviceService: MicroserviceService,
    private applicationService: ApplicationService
  ) {
    super(screenService, messageService);
    this.form = this.fb.group({
      id: '',
      screenName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      screenCode: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      screenDescription: [],
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
      this.loading = true;
      this.collectionService.getData({ id: this.collectionId }).then((res: any) => {
        this.collection = res;
        this.form.patchValue({ collection: res });
        this.loading = false;
      })
    } else {
      this.loading = true;
      this.microserviceService.getAllData().then((res: any) => {
        if (res) {
          this.microserviceItems = res.content;
        }
      })
      this.loading = false;
    }

    this.applicationService.getAllData().then((res: any) => {
      if (res) {
        this.applicationItems = res.content;
      }
    })
  }

  override editData(ds: any): void {
    super.editData(ds);
    this.getCollectionItems();
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
  designScreen(scr: Screen) {

    if (scr.screenDefinition && JSON.parse(scr.screenDefinition).length !== 0) {
      this.router.navigate(['/builder/screens/designer/' + scr.id]);
    } else {
      this.router.navigate(['/builder/screens/templates/' + scr.id]);
    }
  }

}
