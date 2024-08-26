import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { Application } from '../application/application';
import { ApplicationService } from '../application/application.service';
import { Collection } from '../collection/collection';
import { CollectionService } from '../collection/collection.service';
import { FieldService } from '../fields/field.service';
import { MicroService } from '../microservice/microservice';
import { MicroserviceService } from '../microservice/microservice.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericComponent } from '../utils/genericcomponent';
import { Screen } from './screen';
import { ScreenService } from './screen.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
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
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    screenService: ScreenService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private fieldService: FieldService,
    private microserviceService: MicroserviceService,
    private applicationService: ApplicationService,
  ) {
    super(screenService, messageService);
    this.form = this.fb.group({
      id: '',
      screenName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      screenCode: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      screenDescription: [],
      collection: [],
      microService: [],
      application: [],
      process: [],
    });
  }
  ngOnInit(): void {
    this.getAllData();
    this.collectionId = this.route.snapshot.paramMap.get('id');
    if (this.collectionId) {
      this.loading = true;
      this.collectionService
        .getData({ id: this.collectionId })
        .then((res: any) => {
          this.collection = res;
          this.form.patchValue({ collection: res });
          this.loading = false;
        });
    } else {
      this.loading = true;
      this.microserviceService.getAllData().then((res: any) => {
        if (res) {
          this.microserviceItems = res.content;
        }
      });
      this.loading = false;
    }

    this.applicationService.getAllData().then((res: any) => {
      if (res) {
        this.applicationItems = res.content;
      }
    });
  }

  override editData(ds: any): void {
    super.editData(ds);
    this.getCollectionItems();
  }
  getCollectionItems() {
    // this.form.patchValue({ collection: null });
    var filterStr = FilterBuilder.equal(
      'microService.id',
      this.form.value.microService.id,
    );
    this.collectionService.getAllData(undefined, filterStr).then((res: any) => {
      if (res) {
        this.collectionItems = res.content;
      }
    });
  }
  saveFormData() {}

  override preSave(): void {
    if (!this.form.value.collection) {
      if (this.collection) {
        this.form.patchValue({ collection: this.collection });
      } else {
      }
    }
  }

  override saveData() {
    this.preSave();
    this.form.value.collection = null; // No collection for page
    const formData = this.form.value;
    if (!formData.id) {
      this.dataService.createData(formData).then((res: any) => {
        if (res) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            detail: this.componentName + ' created',
            summary: this.componentName + ' created',
          });
          this.getAllData();
          this.postSave(res);
        }
      });
    } else {
      this.dataService.updateData(formData).then((res: any) => {
        if (res) {
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            detail: this.componentName + ' updated',
            summary: this.componentName + ' updated',
          });
          this.getAllData();
          this.postSave(res);
        }
      });
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
