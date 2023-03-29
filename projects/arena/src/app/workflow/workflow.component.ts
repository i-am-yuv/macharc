import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { Workflow } from './workflow';
import { WorkflowService } from './workflow.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent extends GenericComponent implements OnInit {
  componentName: string = 'Microservice';
  form: FormGroup;
  data: Workflow[] = [];

  constructor(
    private fb: FormBuilder,
    wfService: WorkflowService,
    messageService: MessageService) {
    super(wfService, messageService);
    this.form = this.fb.group({
      id: '',
      workflowCode: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      workflowName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    })
  }
  ngOnInit(): void {
    this.getAllData();
  }
}
