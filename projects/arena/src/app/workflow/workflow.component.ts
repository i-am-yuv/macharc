import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { Workflow } from './workflow';
import { WorkflowService } from './workflow.service';
import { Router } from '@angular/router';
import { MicroService } from '../microservice/microservice';
import { MicroserviceService } from '../microservice/microservice.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent extends GenericComponent implements OnInit {
  componentName: string = 'Workflow';
  form: FormGroup;
  data: Workflow[] = [];
  microServices: MicroService[] = [];

  constructor(
    private fb: FormBuilder,
    wfService: WorkflowService,
    messageService: MessageService,
    private microserviceService: MicroserviceService,
    private router: Router) {
    super(wfService, messageService);
    this.form = this.fb.group({
      id: '',
      workflowCode: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      workflowName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      microService: []
    })
  }
  ngOnInit(): void {
    this.getAllData();
    this.getMicroServices();
  }

  getMicroServices() {
    this.microserviceService.getAllData().then((res: any) => {
      this.microServices = res.content;
    })
  }
  showDesigner(wf: Workflow) {
    this.router.navigate(['/builder/workflows/designer/' + wf.id]);
  }

}
