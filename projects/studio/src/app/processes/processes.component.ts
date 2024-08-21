import { Component, OnInit } from '@angular/core';
import { ProcessesService } from './processes.service';
import { Process } from './process';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
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
  
  isModalOpen = false;
  modalTitle = '';
  modalButtonText = '';
  modalType: 'success' | 'failure' = 'success';

  openModal(type: 'success' | 'failure', title: string, btnText: string) {
    this.modalTitle = title;
    this.modalButtonText = btnText;
    this.modalType = type;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  override postSaveShowModal(res: any, resposeType: string) {
    // you will open the model with the type       
    if (resposeType == 'createdSuccess') {
      this.openModal('success', res+' created','OK');    
    } else if (resposeType == 'createdError') {
      this.openModal('failure', res+' creation failed','OK');    

    } else if (resposeType == 'updatedSuccess') {
      this.openModal('success', res+' updated','OK');    

    } else if (resposeType == 'updatedError') {
      this.openModal('failure', res+' updation failed','OK');    

    }
  }
}
