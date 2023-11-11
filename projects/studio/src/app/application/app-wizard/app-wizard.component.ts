import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { ApplicationService } from '../../application/application.service';
import { GenericComponent } from '../../utils/genericcomponent';

@Component({
  selector: 'app-app-wizard',
  templateUrl: './app-wizard.component.html',
  styleUrls: ['./app-wizard.component.scss']
})
export class AppWizardComponent extends GenericComponent {
  override form: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Application';
  id: string | null = '';
  items = [
    {
      label: 'Application', routerLink: '', icon: 'cog',
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
    applicationService: ApplicationService,
    messageService: MessageService,
    private fb: FormBuilder,
    private route: ActivatedRoute) {
    super(applicationService, messageService);

    this.form = this.fb.group({
      id: '',
      applicationName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      applicationCode: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      applicationDescription: [],
      backendApiUrl: []
    });

    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    if (this.id) {
      this.getData({ id: this.id }, (res) => { this.form.patchValue({ ...res }) });
    }
  }
}
