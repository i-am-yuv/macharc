import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { Collection } from './collection';
import { CollectionService } from './collection.service';
import { MicroserviceService } from '../microservice/microservice.service';


@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent extends GenericComponent implements OnInit {


  form: FormGroup<any>;
  data: Collection[] = [];
  componentName: string = 'Collection';
  microService: any = {};
  microserviceItems: any[] = [];
  microserviceId: string | undefined | null;

  constructor(
    private fb: FormBuilder,
    collectionService: CollectionService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private microserviceService: MicroserviceService
  ) {
    super(collectionService, messageService);
    this.form = this.fb.group({
      id: '',
      collectionName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      customTableName: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      crud: [],
      readonly: [],
      hasService: [],
      microService: []
    })
  }
  ngOnInit(): void {
    this.getAllData();
    this.microserviceId = this.route.snapshot.paramMap.get('id');
    if (this.microserviceId) {
      this.microserviceService.getData({ id: this.microserviceId }).then((res: any) => {
        this.microService = res;
        this.form.patchValue({ microservice: res });
      })
    } else {
      this.microserviceService.getAllData().then((res: any) => {
        if (res) {
          this.microserviceItems = res.content;
        }
      })
    }
  }
  override preSave(): void {
    if (!this.form.value.microService) {
      console.log('here');

      this.form.patchValue({ microservice: this.microService });
    }
  }


  editFields(collection: Collection) {
    this.router.navigate(['/builder/fields/' + collection.id]);
  }
}
