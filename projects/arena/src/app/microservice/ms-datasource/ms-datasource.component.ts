import { Component, OnInit } from '@angular/core';
import { GenericComponent } from '../../utils/genericcomponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@splenta/vezo';
import { MicroserviceService } from '../microservice.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-ms-datasource',
  templateUrl: './ms-datasource.component.html'
})
export class MsDatasourceComponent extends GenericComponent implements OnInit {

  form: FormGroup<any>;
  data: any[] = [];
  componentName: string = '';
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    msService: MicroserviceService,
    messageService: MessageService) {
    super(msService, messageService);
    this.form = this.fb.group({
      id: '',
      datasources: this.fb.group({ id: '' })
    })
  }
  ngOnInit(): void {
    var microserviceId = this.route.snapshot.paramMap.get('id');
    this.getData({ id: microserviceId });
    this.form.patchValue({ id: microserviceId });
  }
}
