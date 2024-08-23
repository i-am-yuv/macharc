import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { Collection } from '../collection/collection';
import { CollectionService } from '../collection/collection.service';
import { MicroService } from '../microservice/microservice';
import { MicroserviceService } from '../microservice/microservice.service';
import { GenericComponent } from '../utils/genericcomponent';
import { Report } from './report';
import { ReportService } from './report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent extends GenericComponent {
  override form: FormGroup<any>;

  report!: FormGroup<any>;
  data: Report[] = [];
  componentName: string = 'Report';
  collectionId: string | null | undefined = '';
  collectionItems: Collection[] = [];
  collection: Collection = {};
  microserviceItems: MicroService[] = [];
  override pageData = {};

  constructor(
    private fb: FormBuilder,
    reportService: ReportService,
    messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private microserviceService: MicroserviceService
  ) {
    super(reportService, messageService);
    this.form = this.fb.group({
      id: '',
      reportName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      reportCode: [''],
      reportDescription: [],
      collection: [],
      microService: ['', Validators.required],
      process: [],
    });
  }
  ngOnInit(): void {
    this.getAllData();
    this.collectionId = this.route.snapshot.paramMap.get('id');
    if (this.collectionId) {
      this.collectionService
        .getData({ id: this.collectionId })
        .then((res: any) => {
          this.collection = res;
          this.report.patchValue({ collection: res });
        });
    } else {
      this.microserviceService.getAllData().then((res: any) => {
        if (res) {
          this.microserviceItems = res.content;
        }
      });
    }
  }

  saveFormData() {
    console.log(this.report.value);
  }

  designReport(scr: Report) {
    this.router.navigate(['/builder/reports/designer/' + scr.id]);
  }
}
