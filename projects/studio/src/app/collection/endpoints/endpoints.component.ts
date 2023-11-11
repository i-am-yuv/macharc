import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../collection.service';
import { ActivatedRoute } from '@angular/router';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { Collection } from '../collection';
import { GenericComponent } from '../../utils/genericcomponent';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EndpointService } from './endpoint.service';
import { MessageService } from '@splenta/vezo';
import { Workflow } from '../../workflow/workflow';
import { WorkflowService } from '../../workflow/workflow.service';
@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent extends GenericComponent implements OnInit {
  editorOptions = { theme: 'vs-dark', language: 'json', formatOnPaste: true };
  requestJson = '';
  responseJson = '';
  getEpColor(type: any) {
    const colors = [
      { type: 'GET', color: 'green' },
      { type: 'POST', color: 'orange' },
      { type: 'PUT', color: 'purple' },
      { type: 'PATCH', color: 'yellow' },
      { type: 'DELETE', color: 'red' },
    ];

    return colors.find(t => t.type === type)?.color;
  }

  form: FormGroup<any>;
  data: any[] = [];
  componentName: string = '';
  collectionId: string | null;
  collection: Collection = {};
  services: Workflow[] = [];

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
  pathVariables: any[] = [];

  constructor(
    messageService: MessageService,
    endpointService: EndpointService,
    private workflowService: WorkflowService,
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private route: ActivatedRoute) {
    super(endpointService, messageService);
    this.collectionId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      id: '',
      endpointName: [''],
      endpointPath: [''],
      endpointType: [''],
      description: [''],
      returnType: [''],
      pathVariables: [''],
      service: [''],
      crud: [false]
    })
  }
  ngOnInit(): void {
    if (this.collectionId) {
      this.collectionService.getData({ id: this.collectionId }).then((res) => {
        this.collection = res;
      })
    }
    var filterStr = FilterBuilder.equal('collection.id', this.collectionId!);
    this.search = filterStr;
    this.getAllData();
    // TODO: Filter by microservice
    this.workflowService.getAllData().then((res: any) => {
      this.services = res.content
    })
  }

  override preSave(): void {
    this.form.patchValue({ pathVariables: JSON.stringify(this.pathVariables) })
  }
  addPathVariable() {
    this.pathVariables.push({ variableName: '', variableType: '' })
  }
}
