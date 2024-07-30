import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
import { ProjectService } from '../../project/project.service';
import { GenericComponent } from '../../utils/genericcomponent';
import { MicroserviceService } from '../microservice.service';

@Component({
  selector: 'app-ms-form',
  templateUrl: './ms-form.component.html',
  styleUrls: ['./ms-form.component.scss'],
})
export class MsFormComponent extends GenericComponent {
  override form!: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Microservice Form';
  msId: string | null;
  packaging: any[] = ['Jar', 'War'];
  projects: any[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    msService: MicroserviceService,
    messageService: MessageService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private micrService: MicroserviceService
  ) {
    super(msService, messageService);
    this.msId = this.route.snapshot.paramMap.get('id');
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
      project: [''],
    });
  }

  ngOnInit(): void {
    if (this.msId) {
      this.getData({ id: this.msId }, this.loadData.bind(this));
    }
    this.projectService.getAllData().then((res: any) => {
      this.projects = res.content;
    });
  }
  loadData(res: any): void {
    this.form.patchValue({ ...res });
  }

  saveMicroService() {
    this.loading = true;
    this.micrService
      .saveMicroservice(this.form.value)
      .then((res: any) => {
        if (res) {
          this.messageService.add({
            severity: 'success',
            summary: 'Generated',
            detail: 'Microservice created',
          });
        }
        this.loading = false;
      })
      .catch((e) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error Generating',
          detail: 'Sorry, there was an error generating the microservice',
        });
      });
  }
}
