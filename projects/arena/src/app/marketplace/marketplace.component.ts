import { Component, OnInit } from '@angular/core';
import { GenericComponent } from '../utils/genericcomponent';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo';
import { MicroService } from '../microservice/microservice';
import { MicroserviceService } from '../microservice/microservice.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent extends GenericComponent implements OnInit {

  componentName: string = 'Marketplace';
  form: FormGroup;
  data: MicroService[] = [];

  showGrid: boolean = true;

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
