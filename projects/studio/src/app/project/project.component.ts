import { Component } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormGroup } from '@angular/forms';
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

  constructor(projectService: ProjectService, messageService: MessageService) {
    super(projectService, messageService);
  }

}
