import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { LayoutService } from '../../layout/layout.service';
import { GenericComponent } from '../../utils/genericcomponent';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent extends GenericComponent {
  override form: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Project';
  id: string | null = '';
  items = [
    {
      label: 'Project',
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
  constructor(
    projectService: ProjectService,
    messageService: MessageService,
    private layoutService: LayoutService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(projectService, messageService);

    this.form = this.fb.group({
      id: '',
      projectName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      projectCode: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      projectDescription: ['', Validators.required],
      isdefault: [false],
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.id) {
      this.getData({ id: this.id }, (res) => {
        this.form.patchValue({ ...res });
      });
    }
    // this.layoutService.checkPadding(false);
  }

  milestoneItems = [
    {
      name: 'Define Project',
      link: '.',
    },
    {
      name: 'Define Datasources',
      link: '/builder/datasources',
    },
    {
      name: 'Create  Microservices',
      link: '/builder/microservices',
    },
    {
      name: 'Define Services',
      link: '/builder/services',
    },
    {
      name: 'Create Frontend Applications',
      link: '/applications',
    },
    {
      name: 'Preview Screens',
      link: '/builder/screens',
    },
    {
      name: 'Build Deploy',
      link: '/releases',
    },
  ];

  labelStyle = {
    size: '16px',
    weight: '400',
    color: '#000000',
  };

  naviagateListingPage() {
    this.router.navigate(['projects']);
  }

  override postSave(data: any) {
    this.naviagateListingPage();
  }
}
