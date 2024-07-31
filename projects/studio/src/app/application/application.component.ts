import { Component } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from '@splenta/vezo/src/public-api';
import { ApplicationService } from '../application/application.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent extends GenericComponent {
  override form!: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Application';

  constructor(dataService: ApplicationService, messageService: MessageService, private fb: FormBuilder,
    private router: Router
  ) {
    super(dataService, messageService);
  }

  ngOnInit() {
    this.getAllData();
  }
  setDefault(application: any) {
    application.isdefault = true;
    this.dataService.updateData(application).then((res: any) => {
      if (res) this.getAllData();
      this.messageService.add({ severity: 'success', detail: 'Default Set', summary: 'Success' })
    });
  }

  goToApplicationPages(application: any) {
    // [routerLink] = "['/builder/screens']"
    
  }

  goToApplicationComponents() {

  }

  goToApplicationActions() {

  }


}
