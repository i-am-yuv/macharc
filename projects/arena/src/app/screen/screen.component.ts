import { Component, OnInit } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScreenService } from './screen.service';
import { Screen } from './screen';
import { MessageService } from '@splenta/vezo';
import { Collection } from '../collection/collection';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../collection/collection.service';

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

  constructor(
    private fb: FormBuilder,
    screenService: ScreenService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
  ) {
    super(screenService, messageService);
    this.form = this.fb.group({
      id: '',
      screenName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      screenCode: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      screenDescription: [],
      collection: [],
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
      this.collectionService.getAllData().then((res: any) => {
        if (res) {
          this.collectionItems = res.content;
        }
      })
    }
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
    this.router.navigate(['/builder/screens/designer/' + scr.id]);
  }

}
