import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, Pagination } from '@splenta/vezo/src/public-api';
import { parseISO } from 'date-fns/parseISO';
import {
  Definition,
  Designer,
  GlobalEditorContext,
  Properties,
  Step,
  StepEditorContext,
  StepsConfiguration,
  ToolboxConfiguration,
} from 'sequential-workflow-designer';
import { Collection } from '../../collection/collection';
import { CollectionService } from '../../collection/collection.service';
import { Endpoint } from '../../collection/endpoints/endpoint';
import { EndpointService } from '../../collection/endpoints/endpoint.service';
import { Field } from '../../fields/field';
import { FieldService } from '../../fields/field.service';
import { MicroService } from '../../microservice/microservice';
import { MicroserviceService } from '../../microservice/microservice.service';
import { ProjectService } from '../../project/project.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { GenericComponent } from '../../utils/genericcomponent';
import {
  BusinessLogic,
  CollectionObj,
  Condition,
  ConditionGroup,
  InputParam,
  pojoMappedModel,
  reqDtoMappedModel,
} from '../business-logic';
import { BusinessLogicService } from '../business-logic.service';

function createDefinition() {
  return {
    properties: {
      collections: [],
      schedule: '24/08/2024',
      // declarations: '',
      returnType: 'void',
    },
    sequence: [],
  };
}

@Component({
  selector: 'app-businessLogic-designer',
  templateUrl: './business-logic-designer.component.html',
  styleUrls: ['./business-logic-designer.component.scss'],
})
export class BusinessLogicDesignerComponent
  extends GenericComponent
  implements OnInit {
  form!: FormGroup<any>;
  data: Collection[] = [];
  allMicroservice: MicroService[] = [];
  componentName: string = '';

  private designer?: Designer;
  projectId: any;

  public definition: Definition = createDefinition();
  public definitionJSON?: string;

  wfId: string | null = '';
  wf: BusinessLogic = {};
  dataDef: string | undefined = '';
  returnType = [
    { name: 'void', label: 'void' },
    { name: 'custom', label: 'custom' },
  ];

  dataTypes = [
    { name: 'String', label: 'String' },
    { name: 'Integer', label: 'int' },
    { name: 'BigDecimal', label: 'Decimal' },
    { name: 'Long', label: 'Long' },
    { name: 'UUID', label: 'UUID' },
    { name: 'Model', label: 'Model' },
  ];

  operators = [
    { name: '<', label: 'Less Than' },
    { name: '>', label: 'Greater Than' },
    { name: '==', label: 'Equal To' },
    { name: '!=', label: 'Not Equal To' },
    { name: '<=', label: 'Less Than Or Equal To' },
    { name: '>=', label: 'Greater Than Or Equal To' },
    { name: '~', label: 'Contains' },
  ];

  connector = [
    { name: 'AND', label: '&&' },
    { name: 'OR', label: '||' },
  ];

  operations = [
    { name: 'Find all', label: 'FindAll' },
    // { name: 'Find one', label: 'FindOne' },
    { name: 'Find by an Id', label: 'FindById' },
    { name: 'Custom JPA query', label: 'CustomJpaQuery' },
  ];
  activeConditions: any[] = [];
  allModels: Collection[] = [];
  allEndpointsByModel: Endpoint[] = [];
  allFieldsByReqDto: Field[] = [];

  allPojos: [] = [];

  showConditionEditor: boolean = false;
  showModelsOptions: boolean = false;
  showParamsOptions: boolean = false;
  showFetchDataPopup: boolean = false;
  showLoopEditor: boolean = false;
  showAPIEditor: boolean = false;
  showSaveDataEditor: boolean = false;
  showSetResponseDataEditor: boolean = false;

  conditionEditor: any;
  ModelEditor: any;
  loopEditor: any;
  apiEditor: any;
  paramsEditor: any;
  saveDataEditor: any;
  fetchDataEditor: any;
  setResDataEditor: any;

  constructor(
    private businessLogicService: BusinessLogicService,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private collectionService: CollectionService,
    private microserivce: MicroserviceService,
    private fieldsService: FieldService,
    private projectService: ProjectService,
    private endpointService: EndpointService
  ) {
    super(collectionService, msgService);
    this.getAllMicroSerivices();
  }

  getAllMicroSerivices() {
    this.projectService.getActiveProject().subscribe((val) => {
      this.projectId = val?.id;
      if (this.projectId) {
        var filterStr = FilterBuilder.equal('project.id', this.projectId);
        this.search = filterStr;
        var pagination!: Pagination;
        this.microserivce.getAllData(pagination, this.search).then((res) => {
          this.allMicroservice = res.content;
          console.log(this.allMicroservice);
        });
      }
    });
  }

  public readonly toolboxConfiguration: ToolboxConfiguration = {
    groups: [
      // {
      //   name: 'Main',
      //   steps: [
      //     {
      //       componentType: 'task',
      //       name: 'Step',
      //       properties: { velocity: 0 },
      //       type: 'task'
      //     },
      //     {
      //       componentType: 'switch',
      //       type: 'if',
      //       name: 'If',
      //       properties: {},
      //     }
      //   ]
      // },
      this.toolboxGroup('Main'),
    ],
  };

  public readonly stepsConfiguration: StepsConfiguration = {
    iconUrlProvider: (componentType, type) => `./assets/${type}.svg`,
    validator: () => true,
  };

  public ngOnInit() {
    this.updateDefinitionJSON();
    this.wfId = this.route.snapshot.paramMap.get('id');
    this.businessLogicService.getData({ id: this.wfId }).then((res: any) => {
      if (res) {
        this.wf = res;
        this.dataDef = this.wf.workflowDefinition;
        if (this.dataDef) {
          this.definition = JSON.parse(this.dataDef);
          this.updateDefinitionJSON();
          this.populateEditorFormsData();
        }
        this.getAllModels();
        this.getAllPojos();
      }
    });
  }
  populateEditorFormsData() {
    if (this.definition.properties['collections']) {
      this.selectedModels = this.definition.properties['collections'];
    }
    !this.definition.properties['returnType']
      ? (this.resType = 'void')
      : (this.resType = 'custom');

    this.definition.properties['returnType']
      ? (this.selectedResOp = this.definition.properties['returnType'])
      : null;

    if (this.definition.properties['schedule']) {
      this.selectedDate = parseISO(
        this.definition.properties['schedule'].toString()
      );
    }

    this.selectedParams = this.definition.properties['params'];

    // TODO: Add other vatiables for step editor model forms
  }
  public onDesignerReady(designer: Designer) {
    this.designer = designer;
    // console.log('designer ready', this.designer);
  }

  public onDefinitionChanged(definition: Definition) {
    this.definition = definition;
    this.updateDefinitionJSON();
    console.log('definition changed');
  }

  public updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  public updateProperty(
    properties: Properties,
    name: string,
    event: Event,
    context: GlobalEditorContext | StepEditorContext
  ) {
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }

  public reloadDefinitionClicked() {
    this.definition = createDefinition();
    this.updateDefinitionJSON();
  }

  private updateDefinitionJSON() {
    this.definitionJSON = JSON.stringify(this.definition, null, 2);
  }
  createTaskStepAPI(
    id: null,
    type: string,
    name: string,
    properties: any | undefined
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {
        collection: '',
        endpoint: '',
        mappedData: [],
      },
    };
  }

  createSaveDataTaskStep(
    id: null,
    type: string,
    name: string,
    properties: any | undefined
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {},
    };
  }

  createSetResponseDataStep(
    id: null,
    type: string,
    name: string,
    properties: any | undefined
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {},
    };
  }

  createFetchDataStep(
    id: null,
    type: string,
    name: string,
    properties: any | undefined
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || {
        schedule: 0,
        model: name,
        queryType: '',
        customQuery: 'null',
      },
    };
  }

  createImportStep(
    id: null,
    type: string,
    name: string,
    properties: any | undefined
  ) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || { velocity: 0, name: name, models: [] },
    };
  }

  createIfStep(id: null, _true: never[], _false: never[]) {
    return {
      id,
      componentType: 'switch',
      type: 'if',
      name: 'If',
      branches: {
        true: _true,
        false: _false,
      },
      properties: {},
    };
  }

  createContainerStep(id: any, steps: any) {
    return {
      id,
      componentType: 'container',
      type: 'loop',
      name: 'Loop',
      properties: {},
      sequence: steps,
    };
  }
  toolboxGroup(name: any) {
    return {
      name,
      steps: [
        // this.createImportStep(null, 'import', 'Import Models', null),
        this.createFetchDataStep(null, 'getDsData', 'Fetch Data', null),
        this.createIfStep(null, [], []),
        this.createContainerStep(null, []),
        // this.createTaskStep(null, 'email', 'Send email', null),
        this.createTaskStepAPI(null, 'callWebclient', 'Call API', null),
        this.createSaveDataTaskStep(null, 'saveDsData', 'Save data', null),
        this.createSetResponseDataStep(
          null,
          'import',
          'Set Response Data',
          null
        ),
      ],
    };
  }

  saveDefinition() {
    this.wf.workflowDefinition = this.definitionJSON;
    this.businessLogicService.updateData(this.wf).then((res: any) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Definition updated',
      });
    });
  }

  generateServiceCode() {
    this.updateDefinitionJSON();
    this.wf.workflowDefinition = this.definitionJSON;
    this.businessLogicService.generateServiceCode(this.wf).then((res: any) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Generated',
        detail: 'Code generated',
      });
    });
  }

  openConditionEditor(editor: any) {
    console.log(editor);
    // For New Entry Reseting the data
    if (Object.keys(editor.step.properties).length === 0) {
      console.log('New Entry');
      this.conditionGroups = [
        {
          conditions: [
            {
              firstValue: '',
              operator: '=',
              secondValue: null,
              manualEntry: false,
            },
          ],
        }
      ];

    }
    this.conditionEditor = editor;
    this.showConditionEditor = !this.showConditionEditor;
  }

  openLoopEditor(editor: any) {
    this.showLoopEditor = !this.showLoopEditor;
    this.loopEditor = editor;
  }

  openModelsPopup(editor: any) {
    this.showModelsOptions = !this.showModelsOptions;
    this.ModelEditor = editor;
  }

  openParamsPopup(editor: any) {
    this.showParamsOptions = !this.showParamsOptions;
    this.paramsEditor = editor;
  }

  openAPIEditor(editor: any) {
    console.log(editor);
    // For New Entry Reseting the data
    if (editor.step.properties.collection == '') {
      console.log('New Entry');
      this.modelSelectedAPI = {};
      this.currentEndpointByModel = {};
      this.reqDtoModelMappedList = [];
    }
    this.apiEditor = editor;
    this.showAPIEditor = !this.showAPIEditor;
  }

  openSaveDataEditor(editor: any) {
    this.showSaveDataEditor = !this.showSaveDataEditor;
    this.saveDataEditor = editor;
  }

  openSetResponseDataEditor(editor: any) {
    console.log(editor);
    // For New Entry Reseting the data

    if (Object.keys(editor.step.properties).length === 0) {
      console.log('New Entry');
      this.selectedResPojo = {};
      this.pojoModelMappedList = [];
      this.selectedPojoFields = [];
    }

    this.setResDataEditor = editor;
    this.showSetResponseDataEditor = !this.showSetResponseDataEditor;
  }

  updateConditions() {
    // to handle this by partha
  }

  // New Code -------------------------------------------------------------------------------------------->

  selectedModels: Collection[] | any = [];
  currentModel: Collection = {};
  msSelected: MicroService = {};
  selectedOperation: any;
  selectedResOp: Collection | any = {};
  selectedDate: any;
  fieldArrays: Field[] = [];
  finalListModels: CollectionObj[] = [];
  saveDataModel: Collection = {};
  selectedResPojo: Collection = {};
  selectedPojoFields: Field[] = [];

  selectedParams: InputParam[] | any = [{ dataType: '', varName: '' }];

  modelSelectedAPI: Collection = {};
  currentEndpointByModel: Endpoint = {};
  selectedModelForDtoField: [] = [];
  selectedModelForsetResField: [] = [];

  loopFirstValue: any;
  loopOperator: any;
  loopSecondValue: any;
  loopStaticValue: any;
  resType: any;
  fetchDataSchedule: any;
  customJPAQuery: any;
  loopManualEntry: boolean = false;

  getAllModels() {
    this.businessLogicService
      .getModelsByMicroserivce(this.wf.microService?.id!)
      .then((res: any) => {
        this.allModels = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAllPojos() {
    this.businessLogicService
      .getPojosByMicroserivce(this.wf.microService?.id!)
      .then((res: any) => {
        this.allPojos = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Save Models Code Start
  saveModels(editor: any) {
    this.updatePropertyCollection(
      editor.definition.properties,
      'collections',
      this.selectedModels,
      this.selectedParams,
      editor.context
    );

    this.showModelsOptions = false;
  }

  saveParams(editor: any) {
    this.updatePropertyCollection(
      editor.definition.properties,
      'params',
      this.selectedModels,
      this.selectedParams,
      editor.context
    );

    this.showParamsOptions = false;
  }

  public updatePropertyCollection(
    properties: Properties,
    name: string,
    selectedModels: any,
    selectedParams: InputParam[],
    context: GlobalEditorContext | StepEditorContext
  ) {
    properties[name] = selectedModels;
    properties['schedule'] = this.selectedDate;
    properties['params'] = selectedParams;
    if (this.selectedResOp !== null && this.resType !== 'void') {
      properties['returnType'] = this.selectedResOp;
    } else if (this.resType === 'void') {
      properties['returnType'] = null;
    }

    this.fieldArrays = [];
    var i = 0;
    this.finalListModels = [];
    // Loop through selectedModels
    for (let i = 0; i < selectedModels.length; i++) {
      const model = selectedModels[i];
      const filterStr = FilterBuilder.equal('collection.id', model.id + '');
      this.search = filterStr;
      let pagination!: Pagination;

      this.fieldsService
        .getAllData(pagination, this.search)
        .then((res: any) => {
          for (var k = 0; k < res.content.length; k++) {
            this.fieldArrays.push(res.content[k]);
          }

          const items = res.content.map((field: any) => ({
            label: field.fieldName,
            value: field,
          }));

          const collectionObj = {
            label: model.collectionName,
            value: model,
            items: items,
          };
          this.finalListModels.push(collectionObj);
        });
    }
    console.log(this.finalListModels);
    context.notifyPropertiesChanged();
  }

  // Fetch Data Code Start

  openFetchDataEditor(editor: any) {
    this.showFetchDataPopup = !this.showFetchDataPopup;
    this.fetchDataEditor = editor;
  }

  saveFetchData(editor: any) {
    // this.sequence.find(item => item.type === "getDsData");
    console.log(JSON.stringify(editor));
    this.saveInfoFetch(editor.step, editor.context);
  }

  public saveInfoFetch(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    // sequence = sequence.find((item: any) => item.type === 'getDsData');
    sequence.properties['model'] = this.currentModel;
    if (this.selectedOperation == 'CustomJpaQuery') {
      sequence.properties['queryType'] = this.selectedOperation;
      sequence.properties['customQuery'] = this.customJPAQuery;
    } else {
      sequence.properties['queryType'] = this.selectedOperation;
      sequence.properties['customQuery'] = 'null';
    }
    sequence.properties['schedule'] = this.fetchDataSchedule;

    context.notifyPropertiesChanged();
    this.showFetchDataPopup = false;
  }

  onSelectionChange(event: any) {
    console.log('Selected option:', this.selectedOperation);
  }

  // Loop Code Start
  updateConditionsLoop(editor: any) {
    console.log(JSON.stringify(editor));
    this.saveInfoLoop(editor.step, editor.context);

    this.showLoopEditor = false;
  }

  public saveInfoLoop(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    // sequence = sequence.find((item: any) => item.type === 'loop');
    sequence.properties['conditionGroups'] = [];
    let isManualEntry: boolean = false;
    if (this.loopStaticValue) {
      isManualEntry = true;
    }
    var conditions: any[] = [
      {
        conditions: [
          {
            firstValue: this.loopFirstValue,
            operator: this.loopOperator.name,
            secondValue: this.loopSecondValue ? this.loopSecondValue : null,
            manualEntry: isManualEntry,
            manualEntryValue: this.loopStaticValue,
          },
        ],
      },
    ];
    sequence.properties['conditionGroups'] = conditions;
    // sequence.properties['conditionGroups'][0][''] = this.loopFirstValue;
    // sequence.properties['conditionGroups'][0]['operator'] =
    //   this.loopOperator.name;
    // sequence.properties['conditionGroups'][0]['secondValue'] =
    //   this.loopSecondValue;
    // sequence.properties['conditionGroups'][0]['staticValue'] =
    //   this.loopStaticValue;
    context.notifyPropertiesChanged();
  }

  handleValueChanges(e: any) {
    console.log(e);
    if (e == 'manual') {
      this.loopManualEntry = true;
    }
  }

  // If else condition code Start
  conditionGroups: ConditionGroup[] = [
    {
      conditions: [
        {
          firstValue: '',
          operator: '=',
          secondValue: null,
          manualEntry: false,
        },
      ],
    },
  ];
  newConditionGroupConnector: string = 'AND';

  getDropdownOptions() {
    const newObject: CollectionObj = {
      label: 'Manual',
      value: 'manual',
      items: [
        {
          label: 'Enter Manual',
          value: 'manual',
        },
      ],
    };
    // return this.finalListModels ;
    return [newObject, ...this.finalListModels];
  }

  addCondition(groupIndex: number): void {
    const group = this.conditionGroups[groupIndex];
    if (group.conditions.length > 0) {
      group.conditions[group.conditions.length - 1].connector =
        group.connector || 'AND';
    }
    group.conditions.push({
      firstValue: '',
      operator: '=',
      secondValue: null,
      manualEntry: false,
      manualEntryValue: '',
    });
  }

  // addCondition(groupIndex: number): void {
  //   this.conditionGroups[groupIndex].conditions.push({ firstValue: '', operator: '=', secondValue: '', manualEntry: false });
  // }

  removeCondition(groupIndex: number, conditionIndex: number): void {
    this.conditionGroups[groupIndex].conditions.splice(conditionIndex, 1);
    if (this.conditionGroups[groupIndex].conditions.length === 0) {
      this.conditionGroups[groupIndex].conditions.push({
        firstValue: '',
        operator: '=',
        secondValue: null,
        manualEntry: false,
      });
    }
  }

  addConditionGroup(): void {
    const lastGroup = this.conditionGroups[this.conditionGroups.length - 1];
    lastGroup.connector = this.newConditionGroupConnector;
    this.conditionGroups.push({
      conditions: [
        {
          firstValue: '',
          operator: '=',
          secondValue: null,
          manualEntry: false,
        },
      ],
    });
  }

  handleSecondValueChange(condition: Condition, e: any): void {
    console.log(this.finalListModels);
    console.log(e);
    if (e === 'manual') {
      condition.manualEntry = true;
      condition.secondValue = null;
    } else {
      condition.manualEntry = false;
    }
  }

  updateIfConditions(editor: any) {
    console.log(editor);
    this.saveIfConditions(editor.step, editor.context);

    this.showConditionEditor = false;
  }

  saveIfConditions(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    const payload = this.conditionGroups.map((group) => ({
      conditions: group.conditions,
      connector: group.connector,
    }));
    console.log('Payload:', JSON.stringify(payload));

    // sequence = sequence.find((item: any) => item.type === 'if');
    sequence.properties['conditionGroups'] = payload;
    context.notifyPropertiesChanged();
  }

  // Save Data Code Start

  updateSaveDataEditor(editor: any) {
    this.saveThisModel(editor.step, editor.context);

    this.showSaveDataEditor = false;
  }

  saveThisModel(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    // sequence = sequence.find((item: any) => item.type === 'saveDsData');
    sequence.properties['model'] = this.saveDataModel;
    context.notifyPropertiesChanged();
  }

  // Call Api code start
  updateApiEditor(editor: any) {
    console.log(this.msSelected);
    this.saveThisAPICall(editor.step, editor.context);
    this.showAPIEditor = false;
  }

  reqDtoModelMappedList: reqDtoMappedModel[] = [];
  currReqDtoModel!: reqDtoMappedModel;

  saveThisAPICall(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    // sequence = sequence.find((item: any) => item.type === 'callWebclient');

    sequence.properties['collection'] = this.modelSelectedAPI;
    sequence.properties['endpoint'] = this.currentEndpointByModel;
    sequence.properties['mappedData'] = this.reqDtoModelMappedList;
    context.notifyPropertiesChanged();
  }

  modelSelectedForReqDto(reqDtoField: any, modelSelected: any) {
    console.log(reqDtoField);
    console.log(modelSelected);

    const existingIndex = this.reqDtoModelMappedList.findIndex(
      (item) => item.reqDtoField.id === reqDtoField.id
    );

    if (existingIndex !== -1) {
      this.reqDtoModelMappedList[existingIndex].mappedModelField =
        modelSelected;
    } else {
      // this.currReqDtoModel.reqDtoField = reqDtoField;
      // this.currReqDtoModel.mappedModelField = modelSelected;

      this.currReqDtoModel = {
        reqDtoField: reqDtoField,
        mappedModelField: modelSelected,
      };

      this.reqDtoModelMappedList.push(this.currReqDtoModel);
    }
  }

  truncateField(fieldName: string): string {
    const maxLength = 10; // Set your desired max length
    if (fieldName.length > maxLength) {
      return fieldName.substring(0, maxLength) + '...';
    }
    return fieldName;
  }

  getTheReqDtos(selectedModel: Collection) {
    this.endpointService
      .getAllEndpointsByCollection(selectedModel.id)
      .then((res: any) => {
        this.allEndpointsByModel = res;
        console.log('current Endpoints of model');
        console.log(this.allEndpointsByModel);
      });
  }

  endpointChange(endpoint: Endpoint) {
    console.log(endpoint);
    this.fieldsService
      .getFieldsByRequestDto(endpoint.requestDto?.id)
      .then((res: any) => {
        this.allFieldsByReqDto = res;
        console.log(this.allFieldsByReqDto);
      });
  }

  addParam() {
    this.selectedParams.push({});
  }

  // Set Response Pojo Code start

  pojoModelMappedList: pojoMappedModel[] = [];
  currPojoModel!: pojoMappedModel;

  getPojoFields(pojo: Collection) {
    const filterStr = FilterBuilder.equal('collection.id', pojo.id + '');
    this.search = filterStr;
    let pagination!: Pagination;

    this.fieldsService.getAllData(pagination, this.search).then((res: any) => {
      this.selectedPojoFields = res.content;
    });
  }

  modelSelectedForSetResData(pojoField: any, modelSelected: any) {
    const existingIndex = this.pojoModelMappedList.findIndex(
      (item) => item.pojoField.id === pojoField.id
    );

    if (existingIndex !== -1) {
      this.pojoModelMappedList[existingIndex].mappedModelField = modelSelected;
    } else {
      this.currPojoModel = {
        pojoField: pojoField,
        mappedModelField: modelSelected,
      };

      this.pojoModelMappedList.push(this.currPojoModel);
    }
  }

  updateSetResDataEditor(editor: any) {
    console.log(editor.step);
    console.log(this.pojoModelMappedList); // This list is getting changed 
    this.saveThisSetResData(editor.step, editor.context);
    this.showSetResponseDataEditor = false;
  }

  saveThisSetResData(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    // sequence = sequence.find((item: any) => item.type === 'import');
    sequence.properties['pojo'] = this.selectedResPojo;
    sequence.properties['mappedData'] = this.pojoModelMappedList;
    context.notifyPropertiesChanged();
  }
}
