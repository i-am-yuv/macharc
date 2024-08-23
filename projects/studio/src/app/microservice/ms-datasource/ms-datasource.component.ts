import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { Datasource } from '../../datasource/datasource';
import { DatasourceService } from '../../datasource/datasource.service';
import { GenericComponent } from '../../utils/genericcomponent';
import { MicroserviceService } from '../microservice.service';

@Component({
  selector: 'app-ms-datasource',
  templateUrl: './ms-datasource.component.html',
})
export class MsDatasourceComponent extends GenericComponent implements OnInit {
  form: FormGroup<any>;
  data: any[] = [];
  componentName: string = '';
  datasources: Datasource[] = [];
  ds: Datasource = {};
  microserviceId: string | null = '';
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msService: MicroserviceService,
    messageService: MessageService,
    private datasourceService: DatasourceService
  ) {
    super(msService, messageService);
    this.form = this.fb.group({
      id: '',
      datasources: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.microserviceId = this.route.snapshot.paramMap.get('id');
    this.getData({ id: this.microserviceId });
    this.form.patchValue({ id: this.microserviceId });

    this.datasourceService.getAllData().then((res: any) => {
      this.datasources = res.content;
    });
  }

  linkData() {
    // let controlArray = <FormArray>this.form.controls['datasources'];
    // const fb = this.fb.group(this.ds);
    // controlArray.push(fb);
    // this.saveData();
    this.msService.linkDs(this.microserviceId!, this.ds.id!).then((res) => {
      this.getData({ id: this.microserviceId });
      this.visible = false;
      this.messageService.add({
        severity: 'success',
        detail: this.componentName + ' linked',
        summary: this.componentName + ' linked',
      });
    });
  }
  unlinkData(ds: any) {
    this.msService.unLinkDs(this.microserviceId!, ds.id!).then((res) => {
      this.getData({ id: this.microserviceId });
      this.messageService.add({
        severity: 'success',
        detail: this.componentName + ' unlinked',
        summary: this.componentName + ' unlinked',
      });
    });
  }

  regenerateDataSource() {
    this.datasourceService
      .regenerateDatasource(this.microserviceId)
      .then((res) => {
        this.messageService.add({
          severity: 'success',
          detail: this.componentName + ' regenerated',
          summary: this.componentName + ' regenerated',
        });
      });
  }

  
  override postSave(): void {
    this.getData({ id: this.microserviceId });
  }
}
