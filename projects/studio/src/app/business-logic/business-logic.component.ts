import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
import { MicroService } from '../microservice/microservice';
import { MicroserviceService } from '../microservice/microservice.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericComponent } from '../utils/genericcomponent';
import { BusinessLogic } from './business-logic';
import { BusinessLogicService } from './business-logic.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './business-logic.component.html',
  styleUrls: ['./business-logic.component.scss'],
})
export class BusinessLogicComponent extends GenericComponent implements OnInit {
  componentName: string = 'Business Logic';
  form: FormGroup;
  data: BusinessLogic[] = [];
  microServices: MicroService[] = [];
  override pageData = {};
  microService: any = {};
  microserviceId: string | null;

  constructor(
    private fb: FormBuilder,
    wfService: BusinessLogicService,
    messageService: MessageService,
    private microserviceService: MicroserviceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(wfService, messageService);
    this.microserviceId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      id: '',
      workflowCode: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      workflowName: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
      microService: [],
    });
  }
  ngOnInit(): void {
    if (this.microserviceId) {
      this.microserviceService
        .getData({ id: this.microserviceId })
        .then((res: any) => {
          this.microService = res;
          this.form.patchValue({ microservice: res });
        });
      var filterStr = FilterBuilder.equal(
        'microService.id',
        this.microserviceId
      );
      this.search = filterStr;
    }
    this.getAllData();
    this.getMicroServices();
  }

  getMicroServices() {
    this.microserviceService.getAllData().then((res: any) => {
      this.microServices = res.content;
    });
  }
  showDesigner(wf: BusinessLogic) {
    this.router.navigate(['/builder/services/designer/' + wf.id]);
  }
  showAiGen(wf: BusinessLogic) {
    this.router.navigate(['/builder/services/ai/' + wf.id]);
  }

  override preSave() { 
    if (!this.form.value.microService && this.microserviceId ) {
      this.form.value.microService = {
        id: ''
      }
      this.form.value.microService.id = this.microserviceId;
      console.log(this.form.value.microService.id);
    }
  }
}
