import { Component, OnInit } from '@angular/core';
import { ProcessesService } from './processes.service';
import { Process } from './process';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { MicroserviceService } from '../microservice/microservice.service';
import { MicroService } from '../microservice/microservice';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.scss']
})
export class ProcessesComponent extends GenericComponent implements OnInit {

  componentName: string = 'Processes';

  form: FormGroup;
  data: Process[] = [];
  microServices: MicroService[] = [];

  override pageData = {};

  constructor(
    private fb: FormBuilder,
    processService: ProcessesService,
    private microserviceService: MicroserviceService,
    messageService: MessageService,
    private router: Router) {
    super(processService, messageService);
    this.form = this.fb.group({
      id: '',
      processCode: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      processName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
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
  showModeler(pr: Process) {
    this.router.navigate(['/builder/processes/modeler/' + pr.id]);
  }
}
