import { Component } from '@angular/core';
import { GenericComponent } from '../../utils/genericcomponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo/src/public-api';
import { ProjectService } from '../project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent extends GenericComponent {
  override form: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Project';
  id: string | null = '';
  items = [
    {
      label: 'Project', routerLink: '', icon: 'cog',
      items: [
        { label: 'Overview', routerLink: '', icon: 'cog' },
        { label: 'API Endpoints', routerLink: '', icon: 'cog' },
        { label: 'Flow Config', routerLink: '', icon: 'cog' },
        { label: 'API Definition', routerLink: '', icon: 'cog' },
        { label: 'Monetization', routerLink: '', icon: 'cog' },
        { label: 'Deployments', routerLink: '', icon: 'cog' },
        { label: 'Subscriptions', routerLink: '', icon: 'cog' },
      ]
    }
  ]
  constructor(
    projectService: ProjectService,
    messageService: MessageService,
    private layoutService : LayoutService,
    private fb: FormBuilder,
    private router: Router ,
    private route: ActivatedRoute) {
    super(projectService, messageService);

    this.form = this.fb.group({
      id: '',
      projectName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      projectCode: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      projectDescription: [],
      isdefault: [false]
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.id) {
      this.getData({ id: this.id }, (res) => { this.form.patchValue({ ...res }) });
    }
    this.layoutService.checkPadding(false);

  }

  milestoneItems = [
    {
      'name': 'Define Project'
    },
    {
      'name': 'Create  Microservices'
    },
    {
      'name': 'Define Services'
    },
    {
      'name': 'Create Frontend Applications'
    },
    {
      'name': 'Define Prototypes'
    },
    {
      'name': 'Build Deploy'
    }
  ]

  labelStyle = {
    'size':'16px',
    'weight':'400',
    'color':'#000000'
  }

  naviagateListingPage()
  {
    this.router.navigate(['projects']) ;
  }
}

