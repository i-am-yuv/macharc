import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, Pagination } from '@splenta/vezo';
import { BusinessLogic } from '../../business-logic/business-logic';
import { BusinessLogicService } from '../../business-logic/business-logic.service';
import { Datasource } from '../../datasource/datasource';
import { DatasourceService } from '../../datasource/datasource.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { GenericComponent } from '../../utils/genericcomponent';
import { Collection, RequestDto, ResponseDto } from '../collection';
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

  hasCustomEndPoints: boolean = false;
  hasCrudEndPoints: boolean = false;

  getEpColor(type: any) {
    const colors = [
      { type: 'GET', color: 'green' },
      { type: 'POST', color: 'blue' },
      { type: 'PUT', color: 'purple' },
      { type: 'PATCH', color: 'yellow' },
      { type: 'DELETE', color: 'red' },
    ];

    //console.log(colors.find((t) => t.type === type)?.color);
    return colors.find((t) => t.type === type)?.color;
  }

  form: FormGroup<any>;
  data: any[] = [];
  componentName: string = '';
  collectionId: string | null;
  collection: Collection = {};
  services: BusinessLogic[] = [];
  datasources: Datasource[] = [];
  searchByMicroservice!: string;

  defaultValue: string = 'Rahul Kumar'; // Default value

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

  requestDto: RequestDto[] = [];
  responseDto: ResponseDto[] = [];

  constructor(
    messageService: MessageService,
    private endpointService: EndpointService,
    private workflowService: BusinessLogicService,
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private datasourceService: DatasourceService,
    private pathVariableService: PathVariableService,
    private route: ActivatedRoute,
  ) {
    super(endpointService, messageService);
    this.collectionId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      id: '',
      endpointName: [''],
      endpointPath: [''],
      endPointType: [''],
      description: [''],
      // returnType: [''],
      pathVariables: [''],
      workflow: [''],
      crud: [false],
      webclient: [''],
      webhook: [''],
      api: [''],
      requestDto: [''],
      // responseDto:[''],
      collection: [''],
      requestJson: [''],
      responseJson: [''],
    });
  }

  ngOnInit(): void {
    if (this.collectionId) {
      this.collectionService.getData({ id: this.collectionId }).then((res) => {
        this.collection = res;

        // this.currentRequestDto =   ;
        this.requestDto.push(this.collection?.requestDto!);
        this.responseDto.push(this.collection?.responseDto!);

        console.log(this.collection);

        // Now that we already got the Collection
        this.getAllServicesByMicroservices();
        this.getEndPointsByCollectionId();
      });
    }

    this.datasourceService.getAllData().then((res: any) => {
      this.datasources = res.content;
    });
    this.collectionService.getAllData().then((res: any) => {
      this.collections = res.content;
    });
  }

  getAllServicesByMicroservices() {
    //getting the services by microservice
    var filterStrService = FilterBuilder.equal(
      'microService.id',
      this.collection.microService?.id!,
    );
    this.searchByMicroservice = filterStrService;
    var pagination!: Pagination;
    this.workflowService
      .getAllData(pagination, this.searchByMicroservice)
      .then((res: any) => {
        this.services = res.content;
      });
  }

  getEndPointsByCollectionId() {
    this.endpointService
      .getAllEndpointsByCollection(this.collection.id)
      .then((res: any) => {
        this.data = res;
        var crudep = this.data.find((t) => t.crud === true);
        if (crudep) this.hasCrudEndPoints = true;
        var custep = this.data.find((t) => t.crud === false);
        if (custep) this.hasCustomEndPoints = true;
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
    if (
      this.form.value.endPointType == 'GET' ||
      this.form.value.endPointType == 'DELETE'
    ) {
      this.form.value.requestDto = null;
    }
    this.activeEp = this.form.value;
  }
  addPathVariable() {
    this.pathVariables.push({ variableName: '', variableType: '' });
  }

  saveCustomData() {
    if (this.form.value.returnType == 'collection') {
      this.saveData();
    } else {
      this.form.value.responseDto = null;
      console.log(this.form.value);
      this.saveData();
    }
  }

  override postSave(data: any) {
    this.getEndPointsByCollectionId();
  }
}
