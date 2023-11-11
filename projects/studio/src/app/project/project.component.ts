import { Component } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from './project.service';
import { MessageService } from '@splenta/vezo';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent extends GenericComponent {
  override form!: FormGroup<any>;
  override data: any[] = [];
  override componentName: string = 'Project';

  constructor(dataService: ProjectService, messageService: MessageService, private fb: FormBuilder) {
    super(dataService, messageService);
  }

  ngOnInit() {
    this.getAllData();
  }
  setDefault(project: any) {
    project.isdefault = true;
    this.dataService.updateData(project).then((res: any) => {
      if (res) this.getAllData();
      this.messageService.add({ severity: 'success', detail: 'Default Set', summary: 'Success' })
    });
  }
}
