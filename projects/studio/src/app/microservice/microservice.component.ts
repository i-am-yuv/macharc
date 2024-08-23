import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Pagination } from '@splenta/vezo';
import { ProjectService } from '../project/project.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericComponent } from '../utils/genericcomponent';
import { MicroService } from './microservice';
import { MicroserviceService } from './microservice.service';

@Component({
  selector: 'app-microservice',
  templateUrl: './microservice.component.html',
  styleUrls: ['./microservice.component.scss'],
})
export class MicroserviceComponent extends GenericComponent implements OnInit {
  componentName: string = 'Microservice';
  form!: FormGroup;
  data: MicroService[] = [];

  showGrid: boolean = true;
  packaging: any[] = ['Jar', 'War'];
  loading: boolean = false;

  projectId: string | null | undefined;

  override pageData: Pagination = {
    pageNo: 0,
    pageSize: 10,
    sortDir: '',
    sortField: '',
    totalElements: 0,
    offset: 0,
  };
  project = [];

  constructor(
    private fb: FormBuilder,
    msService: MicroserviceService,
    messageService: MessageService,
    private micrService: MicroserviceService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private msgService: MessageService
  ) {
    super(msService, messageService);
    // this.projectId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      id: '',
      microServiceCode: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      microServiceName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      packageName: [''],
      packaging: ['Jar'],
      portNumber: ['', [Validators.required]],
      project: { id: this.projectId },
    });
  }
  ngOnInit(): void {
    this.projectService.getActiveProject().subscribe((val) => {
      // this.projectId = this.projectService.activeProject?.id;
      console.log(val);
      this.projectId = val?.id;
      if (this.projectId) {
        var filterStr = FilterBuilder.equal('project.id', this.projectId);
        this.search = filterStr;
        this.getAllData();
      }
    });
  }

  generateService(ms: MicroService) {
    this.loading = true;
    this.micrService
      .generateCode(ms)
      .then((res: any) => {
        if (res) {
          this.msgService.add({
            severity: 'success',
            summary: 'Generated',
            detail: 'Microservice created',
          });
        }
        this.loading = false;
      })
      .catch((e) => {
        this.loading = false;
        this.msgService.add({
          severity: 'error',
          summary: 'Error Generating',
          detail: 'Sorry, there was an error generating the microservice',
        });
      });
  }

  generateFrontend(ms: MicroService) {
    this.loading = true;
    this.micrService
      .generateFrontendCode(ms)
      .then((res: any) => {
        if (res) {
          this.msgService.add({
            severity: 'success',
            summary: 'Generated',
            detail: 'Microservice Frontend created',
          });
        }
        this.loading = false;
      })
      .catch((e) => {
        this.loading = false;
      });
  }

  getRouterLink() {
    this.router.navigate(['/builder/microservices/create']);
  }

  goToActions( ms : any )
  {
    this.micrService.setActiveMicroservice(ms);
    this.router.navigate(['/actions/null']);
  }
}
