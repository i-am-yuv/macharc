import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, Pagination } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { MicroService } from './microservice';
import { MicroserviceService } from './microservice.service';

@Component({
  selector: 'app-microservice',
  templateUrl: './microservice.component.html',
  styleUrls: ['./microservice.component.scss']
})
export class MicroserviceComponent extends GenericComponent implements OnInit {

  componentName: string = 'Microservice';
  form: FormGroup;
  data: MicroService[] = [];

  showGrid: boolean = false;
  packaging: any[] = ['Jar', 'War'];
  loading: boolean = false;

  override pageData: Pagination = { pageNo: 0, pageSize: 10, sortDir: '', sortField: '', totalElements: 0, offset: 0 };

  constructor(
    private fb: FormBuilder,
    msService: MicroserviceService,
    messageService: MessageService,
    private micrService: MicroserviceService,
    private msgService: MessageService) {
    super(msService, messageService);
    this.form = this.fb.group({
      id: '',
      microServiceCode: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      microServiceName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      packageName: [''],
      packaging: ['Jar'],
      portNumber: ['', [Validators.required]],
    })
  }
  ngOnInit(): void {
    this.getAllData();
  }
  generateService(ms: MicroService) {
    this.loading = true;
    this.micrService.generateCode(ms).then((res: any) => {
      if (res) {
        this.msgService.add({ severity: 'success', summary: 'Generated', detail: 'Microservice created' });
      }
      this.loading = false;
    }).catch(e => {
      this.loading = false;
    })
  }

  generateFrontend(ms: MicroService) {
    this.loading = true;
    this.micrService.generateFrontendCode(ms).then((res: any) => {
      if (res) {
        this.msgService.add({ severity: 'success', summary: 'Generated', detail: 'Microservice Frontend created' });
      }
      this.loading = false;
    }).catch(e => {
      this.loading = false;
    })
  }

}
