import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '@splenta/vezo/src/public-api';
import { GenericComponent } from '../utils/genericcomponent';
import { ProjectService } from './project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent extends GenericComponent {
  override form!: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Project';

  constructor(
    dataService: ProjectService,
    messageService: MessageService,
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {
    super(dataService, messageService);
  }

  ngOnInit() {
    this.getAllData();
  }
  setDefault(project: any) {
    project.isdefault = true;
    this.dataService.updateData(project).then((res: any) => {
      this.projectService.setActiveProject();
      if (res) this.getAllData();
      this.messageService.add({
        severity: 'success',
        detail: 'Default Set',
        summary: 'Success',
      });
    });
  }
}
