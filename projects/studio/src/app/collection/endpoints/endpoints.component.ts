import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
import { BusinessLogic } from '../../business-logic/business-logic';
import { BusinessLogicService } from '../../business-logic/business-logic.service';
import { Datasource } from '../../datasource/datasource';
import { DatasourceService } from '../../datasource/datasource.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { GenericComponent } from '../../utils/genericcomponent';
import { Collection } from '../collection';
import { CollectionService } from '../collection.service';
import { Endpoint } from './endpoint';
import { EndpointService } from './endpoint.service';
import { PathVariable } from './path-variable';
import { PathVariableService } from './path-variable.service';
@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss'],
})
export class EndpointsComponent extends GenericComponent implements OnInit {
  editorOptions = { theme: 'vs-dark', language: 'json', formatOnPaste: true };
  requestJson = '';
  responseJson = '';
  activeEp: Endpoint | undefined;
  getEpColor(type: any) {
    const colors = [
      { type: 'GET', color: 'green' },
      { type: 'POST', color: 'orange' },
      { type: 'PUT', color: 'purple' },
      { type: 'PATCH', color: 'yellow' },
      { type: 'DELETE', color: 'red' },
    ];

    return colors.find((t) => t.type === type)?.color;
  }

  form: FormGroup<any>;
  data: any[] = [];
  componentName: string = '';
  collectionId: string | null;
  collection: Collection = {};
  services: BusinessLogic[] = [];
  datasources: Datasource[] = [];

  returnTypes: any[] = [
    { label: 'Void', value: 'void' },
    { label: 'String', value: 'String' },
    { label: 'Integer', value: 'int' },
    { label: 'Date', value: 'Date' },
    { label: 'Decimal', value: 'BigDecimal' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Collection', value: 'collection' },
  ];
  variableTypes: any[] = [
    { label: 'String', value: 'String' },
    { label: 'UUID', value: 'UUID' },
    { label: 'Integer', value: 'int' },
    { label: 'Date', value: 'Date' },
    { label: 'Decimal', value: 'BigDecimal' },
    { label: 'Boolean', value: 'boolean' },
    { label: 'Collection', value: 'collection' },
  ];
  httpMethods: any[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  pathVariables: PathVariable[] = [];
  collections: Collection[] = [];

  constructor(
    messageService: MessageService,
    endpointService: EndpointService,
    private workflowService: BusinessLogicService,
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private datasourceService: DatasourceService,
    private pathVariableService: PathVariableService,
    private route: ActivatedRoute
  ) {
    super(endpointService, messageService);
    this.collectionId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      id: '',
      endpointName: [''],
      endpointPath: [''],
      endPointType: [''],
      description: [''],
      returnType: [''],
      pathVariables: [''],
      workflow: [''],
      crud: [false],
      datasource: [''],
      webclient: [''],
      webhook: [''],
      api: [''],
      pojo: [''],
      collection: [''],
      requestJson: [''],
      responseJson: [''],
    });
  }
  ngOnInit(): void {
    if (this.collectionId) {
      this.collectionService.getData({ id: this.collectionId }).then((res) => {
        this.collection = res;
      });
    }
    var filterStr = FilterBuilder.equal('collection.id', this.collectionId!);
    this.search = filterStr;
    this.getAllData();
    // TODO: Filter by microservice
    this.workflowService.getAllData().then((res: any) => {
      this.services = res.content;
    });
    this.datasourceService.getAllData().then((res: any) => {
      this.datasources = res.content;
    });
    this.collectionService.getAllData().then((res: any) => {
      this.collections = res.content;
    });
  }

  getPathVariables(ep: Endpoint) {
    this.activeEp = ep;
    var filterStr = FilterBuilder.equal('endpoint.id', ep.id!);
    this.pathVariableService
      .getAllData(undefined, filterStr)
      .then((res: any) => {
        this.pathVariables = res.content;
      });
  }

  editCustomEndpoint(ep: Endpoint) {
    this.editData(ep);
    this.getPathVariables(ep);
  }
  savePathVariable(pv: PathVariable) {
    pv.endpoint = this.activeEp;
    this.pathVariableService.createData(pv).then((res: any) => {
      this.messageService.add({
        severity: 'success',
        detail: 'Path variable added',
        summary: 'Success',
      });
    });
  }

  override preSave(): void {
    this.form.patchValue({ collection: { id: this.collectionId } });
    this.activeEp = this.form.value;
    // this.form.patchValue({ pathVariables: JSON.stringify(this.pathVariables) });
  }
  addPathVariable() {
    this.pathVariables.push({ variableName: '', variableType: '' });
  }
}
