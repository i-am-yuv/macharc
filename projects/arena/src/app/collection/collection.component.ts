import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { Collection } from './collection';
import { CollectionService } from './collection.service';


@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent extends GenericComponent implements OnInit {


  form: FormGroup<any>;
  data: Collection[] = [];
  componentName: string = 'Collection';

  constructor(
    private fb: FormBuilder,
    collectionService: CollectionService,
    messageService: MessageService,
    private router: Router
  ) {
    super(collectionService, messageService);
    this.form = this.fb.group({
      id: '',
      collectionName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      customTableName: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    })
  }
  ngOnInit(): void {
    this.getAllData();
  }

  editFields(collection: Collection) {
    this.router.navigate(['/builder/fields/' + collection.id]);
  }
}
