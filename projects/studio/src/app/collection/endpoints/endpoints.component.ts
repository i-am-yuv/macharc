import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

    //
    return colors.find((t) => t.type === type)?.color;
  }

  form: FormGroup<any>;
  data: any[] = [];
  componentName: string = 'Endpoint';
  collectionId: string | null;
  collection: Collection = {};
  services: BusinessLogic[] = [];
  datasources: Datasource[] = [];
  searchByMicroservice!: string;
  override search: string = '';

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
    { label: 'Model', value: 'collection' },
  ];
  httpMethods: any[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  // pathVariables: PathVariable[] = [{ variableName: '', variableType: '' }];
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
      endpointName: ['', Validators.required],
      endpointPath: ['', Validators.required],
      endPointType: ['', Validators.required],
      description: [''],
      datasource: [''],
      // returnType: [''],
      pathVariables: this.fb.array([this.createPathVariable()]),
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
      apiType: ['webclient'],
    });
  }

  get pathVariables(): FormArray {
    return this.form.get('pathVariables') as FormArray;
  }

  ngOnInit(): void {
    this.collectionId = this.route.snapshot.paramMap.get('id');

    if (this.collectionId) {
      this.collectionService.getData({ id: this.collectionId }).then((res) => {
        this.collection = res;

        // this.currentRequestDto =   ;
        this.requestDto.push(this.collection?.requestDto!);
        this.responseDto.push(this.collection?.responseDto!);

        // Now that we already got the Collection
        this.getAllServicesByMicroservices();
        this.getEndPointsByCollectionId();
      });
    }

    const filterStr = FilterBuilder.equal('dbType', 'API');
    this.datasourceService.getAllData(undefined, filterStr).then((res: any) => {
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
    var filterStr = FilterBuilder.equal(
      'collection.id',
      this.collectionId ? this.collectionId : '',
    );
    this.search = filterStr;
    var pagination!: Pagination;
    this.endpointService
      .getAllData(pagination, this.search)
      .then((res: any) => {
        this.data = res.content;
        var crudep = this.data.find((t) => t.crud === true);
        if (crudep) this.hasCrudEndPoints = true;
        var custep = this.data.find((t) => t.crud === false);
        if (custep) this.hasCustomEndPoints = true;
      });
  }

  // getPathVariables(ep: Endpoint) {
  //   this.activeEp = ep;
  //   var filterStr = FilterBuilder.equal('endpoint.id', ep.id!);
  //   this.pathVariableService
  //     .getAllData(undefined, filterStr)
  //     .then((res: any) => {
  //       if (res.content.length > 0) {
  //         this.pathVariables = res.content;
  //       }
  //     });
  // }
  createPathVariable() {
    return this.fb.group({
      id: '',
      variableName: '',
      variableType: '',
    });
  }
  editCustomEndpoint(ep: Endpoint) {
    this.form.patchValue({ ...ep });
    this.updateFormArray(ep.pathVariables);
  }

  updateFormArray(newValues: any[]) {
    const formArray = this.form.get('pathVariables') as FormArray;

    // Clear the existing form array
    formArray.clear();

    // Add new form groups based on the newValues
    newValues.forEach((value) => {
      formArray.push(
        this.fb.group({
          id: [value.id],
          variableName: [value.variableName],
          variableType: [value.variableType],
        }),
      );
    });
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
  deletePathVariable(pv: PathVariable, index: number) {
    this.pathVariableService.deleteData(pv).then((res: any) => {
      this.pathVariables.removeAt(index);
      this.messageService.add({
        severity: 'success',
        detail: 'Path variable deleted',
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
    const pathVariable = this.form.get('pathVariables') as FormArray;
    pathVariable.push(this.createPathVariable());
  }

  saveCustomData() {
    if (this.form.value.returnType == 'collection') {
      var filterStr = FilterBuilder.equal(
        'collection.id',
        this.collectionId ? this.collectionId : '',
      );
      this.search = filterStr;
      this.saveData();
    } else {
      this.form.value.responseDto = null;

      this.saveData();
    }
  }
}
