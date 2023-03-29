import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo';
import { GenericComponent } from '../utils/genericcomponent';
import { MicroService } from './microservice';
import { MicroserviceService } from './microservice.service';

@Component({
  selector: 'app-microservice',
  templateUrl: './microservice.component.html',
  styleUrls: ['./microservice.component.scss']
})
export class MicroserviceComponent extends GenericComponent implements OnInit {

  componentName: string = 'Microservice';
  form: FormGroup;
  data: MicroService[] = [];

  constructor(
    private fb: FormBuilder,
    msService: MicroserviceService,
    messageService: MessageService) {
    super(msService, messageService);
    this.form = this.fb.group({
      id: '',
      microServiceCode: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      microServiceName: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    })
  }
  ngOnInit(): void {
    this.getAllData();
  }
}
