import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { ProjectService } from '../../project/project.service';
import { GenericComponent } from '../../utils/genericcomponent';

import { environment } from 'projects/studio/src/environments/environment';
import { Project } from '../../project/project';
import { MicroserviceService } from '../microservice.service';

@Component({
  selector: 'app-ms-form',
  templateUrl: './ms-form.component.html',
  styleUrls: ['./ms-form.component.scss'],
})
export class MsFormComponent
  extends GenericComponent
  implements OnInit, OnDestroy
{
  override form!: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Microservice Form';
  msId: string | null;
  packaging: any[] = ['Jar', 'War'];
  projects: any[] = [];
  loading: boolean = false;
  activeProject: Project | undefined = {
    id: '',
    projectName: 'SELECT PROJECT',
  };
  webSocketUrl = environment.webTerminal;
  packageName = '';
  constructor(
    private fb: FormBuilder,
    private msService: MicroserviceService,
    messageService: MessageService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
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
      packaging: ['Jar', Validators.required],
      portNumber: ['', [Validators.required, Validators.maxLength(5)]],
      project: [''],
    });
  }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    if (this.msId) {
      this.getData({ id: this.msId }, this.loadData.bind(this));
    }
    this.projectService.getAllData().then((res: any) => {
      this.projects = res.content;
    });

    // this.projectService.setActiveProject();
    this.projectService.getActiveProject().subscribe((val) => {
      this.activeProject = val;
      console.log(this.activeProject);
    });
  }

  loadData(res: any): void {
    this.form.patchValue({ ...res });
    this.getPackageName();
  }

  packageNameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+){2}$/.test(value);
    return isValid ? null : { invalidFormat: true };
  }

  checkPackageName() {
    this.form.get('packageName')?.updateValueAndValidity();
  }

  getPackageName() {
    this.packageName =
      this.reverseSubdomain(this.activeProject?.domainName!) +
      '.' +
      this.form.controls['microServiceName'].value
        .toLowerCase()
        .replace(' ', '');

    this.form.patchValue({ packageName: this.packageName });
  }

  reverseSubdomain(domain: string): string {
    const parts = domain.split('.');
    const reversedParts = parts.reverse();
    return reversedParts.join('.');
  }

  isModalOpen = false;
  modalTitle = '';
  modalButtonText = '';
  modalType: 'success' | 'failure' = 'success';

  openModal(type: 'success' | 'failure', title: string, btnText: string) {
    this.modalTitle = title;
    this.modalButtonText = btnText;
    this.modalType = type;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.router.navigate(['/builder/microservices']);
    // this.navigateListingPage();
  }

  override saveData() {
    // default sending the active project
    this.form.value.project = this.activeProject;
    const formData = this.form.value;
    console.log(formData);
    if (!formData.id) {
      formData.id = null;
      this.msService
        .createMS(formData)
        .then((res: any) => {
          if (res) {
            this.visible = false;
            // this.messageService.add({
            //   severity: 'success',
            //   detail: this.componentName + ' created',
            //   summary: this.componentName + ' created',
            // });
            this.postSaveShowModal(this.componentName, 'createdSuccess');
            this.getAllData();
          }
        })
        .catch((err) => {
          this.postSaveShowModal(this.componentName, 'createdError');
        });
    } else {
      this.msService
        .createMS(formData)
        .then((res: any) => {
          if (res) {
            this.visible = false;
            // this.messageService.add({
            //   severity: 'success',
            //   detail: this.componentName + ' updated',
            //   summary: this.componentName + ' updated',
            // });
            this.postSaveShowModal(this.componentName, 'updatedSuccess');
            this.getAllData();
            // this.router.navigate(['/builder/microservices']);
          }
        })
        .catch((err) => {
          this.postSaveShowModal(this.componentName, 'updatedError');
        });
    }
  }

  override postSaveShowModal(res: any, resposeType: string) {
    // you will open the model with the type
    if (resposeType == 'createdSuccess') {
      this.openModal('success', res + ' created', 'OK');
    } else if (resposeType == 'createdError') {
      this.openModal('failure', res + ' creation failed', 'OK');
    } else if (resposeType == 'updatedSuccess') {
      this.openModal('success', res + ' updated', 'OK');
    } else if (resposeType == 'updatedError') {
      this.openModal('failure', res + ' updation failed', 'OK');
    }
  }

  title = 'client';

  generateDTO() {
    // Code for generating the DTO Here
  }

  commitCode() {
    this.msService.commitCode(this.msId).then(() => {
      this.messageService.add({
        severity: 'success',
        detail: 'Code commited',
        summary: 'Code commited successfully',
      });
    });
  }
}
