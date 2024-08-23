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

  constructor(
    applicationService: ApplicationService,
    messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private layoutService: LayoutService,
    private route: ActivatedRoute
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
    this.layoutService.checkPadding(false);
  }

  labelStyle = {
    size: '16px',
    weight: '400',
    color: '#000000',
  };

  naviagateListingPage() {
    this.router.navigate(['applications']);
  }

  override postSave(data: any) {
    this.naviagateListingPage();
  }
}
