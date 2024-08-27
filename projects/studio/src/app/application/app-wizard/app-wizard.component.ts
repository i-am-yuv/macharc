import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { ApplicationService } from '../../application/application.service';
import { LayoutService } from '../../layout/layout.service';
import { GenericComponent } from '../../utils/genericcomponent';

@Component({
  selector: 'app-app-wizard',
  templateUrl: './app-wizard.component.html',
  styleUrls: ['./app-wizard.component.scss'],
})
export class AppWizardComponent extends GenericComponent {
  override form: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Application';

  popupModelVisiblility: boolean = false;

  id: string | null = '';
  items = [
    {
      label: 'Application',
      routerLink: '',
      icon: 'cog',
      items: [
        { label: 'Overview', routerLink: '', icon: 'cog' },
        { label: 'API Endpoints', routerLink: '', icon: 'cog' },
        { label: 'Flow Config', routerLink: '', icon: 'cog' },
        { label: 'API Definition', routerLink: '', icon: 'cog' },
        { label: 'Monetization', routerLink: '', icon: 'cog' },
        { label: 'Deployments', routerLink: '', icon: 'cog' },
        { label: 'Subscriptions', routerLink: '', icon: 'cog' },
      ],
    },
  ];

  milestoneItems = [
    {
      name: 'Applications',
      routes: '/applications',
    },
    {
      name: 'Pages',
      routes: '/builder/screens/designer/null',
    },
    {
      name: 'Components',
      routes: '/builder/forms/designer/null',
    },
    {
      name: 'Actions',
      routes: '/actions',
    },
    {
      name: 'Build and Deploy',
      routes: '/releases',
    },
  ];
  loading: boolean = false;

  constructor(
    public applicationService: ApplicationService,
    messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
  ) {
    super(applicationService, messageService);

    this.form = this.fb.group({
      id: '',
      applicationName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      applicationCode: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      applicationDescription: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      enableAuth: [true],
      // backendApiUrl: ['', [Validators.required,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]]
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.id) {
      this.getData({ id: this.id }, (res) => {
        this.form.patchValue({ ...res });
      });
    }
    setTimeout(() => {
      this.layoutService.checkPadding(false);
    });
  }

  ngOnDestroy() {
    this.layoutService.checkPadding(true);
  }
  labelStyle = {
    size: '16px',
    weight: '400',
    color: '#000000',
  };

  naviagateListingPage() {
    this.router.navigate(['applications']);
  }
  closeModelPopup() {
    this.popupModelVisiblility = false;
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
    this.naviagateListingPage();
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

  generateWebFrontend() {
    this.loading = true;
    this.applicationService
      .generateFrontendCode(this.dataSingle)
      .then((res: any) => {
        if (res) {
          this.messageService.add({
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
}
