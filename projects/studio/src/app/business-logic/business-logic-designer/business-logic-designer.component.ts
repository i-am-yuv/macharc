import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService, Pagination } from '@splenta/vezo';
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
  implements OnInit
{
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
    private endpointService: EndpointService,
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
    this.wfId = this.route.snapshot.paramMap.get('id'); // Service ID
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
      this.makeFieldListFromSelectedModel();
    }
    !this.definition.properties['returnType']
      ? (this.resType = 'void')
      : (this.resType = 'custom');

    this.definition.properties['returnType']
      ? (this.selectedResOp = this.definition.properties['returnType'])
      : null;

    if (this.definition.properties['schedule']) {
      this.selectedDate = parseISO(
        this.definition.properties['schedule'].toString(),
      );
    }

    this.selectedParams = this.definition.properties['params'];

    // TODO: Add other vatiables for step editor model forms
  }
  public onDesignerReady(designer: Designer) {
    this.designer = designer;
  }

  public onDefinitionChanged(definition: Definition) {
    this.definition = definition;
    this.updateDefinitionJSON();
  }

  public updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  public updateProperty(
    properties: Properties,
    name: string,
    event: Event,
    context: GlobalEditorContext | StepEditorContext,
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
    properties: any | undefined,
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
    properties: any | undefined,
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
    properties: any | undefined,
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
    properties: any | undefined,
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
    properties: any | undefined,
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
          null,
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
    // For New Entry Reseting the data
    if (Object.keys(editor.step.properties).length === 0) {
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
        },
      ];
    } else {
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          this.conditionGroups = currDefination.properties['conditionGroups'];
        }
      }
    }
    this.conditionEditor = editor;
    this.showConditionEditor = !this.showConditionEditor;
  }

  openLoopEditor(editor: any) {
    if (Object.keys(editor.step.properties).length === 0) {
      this.loopFirstValue = {};
      this.loopOperator = {};
      this.loopSecondValue = {};
      this.loopStaticValue = null;
    } else {
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          const logicGroup: any = currDefination.properties['conditionGroups'];

          logicGroup.forEach((group: any) => {
            // Loop through each condition within the group
            group.conditions.forEach((condition: any) => {
              this.loopFirstValue = condition.firstValue;
              this.loopOperator = condition.operator;
              if (condition.secondValue == 'manual') {
                this.loopStaticValue = condition.manualEntryValue;
                this.loopManualEntry = condition.manualEntry;
                this.loopSecondValue = 'manual';
              } else {
                this.loopSecondValue = condition.secondValue;
                this.loopStaticValue = null;
                this.loopManualEntry = false;
              }
            });
          });
        }
      }
    }
    this.loopEditor = editor;
    this.showLoopEditor = !this.showLoopEditor;
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
    // For New Entry Reseting the data
    if (
      editor.step.properties.collection == '' &&
      editor.step.properties.endpoint == ''
    ) {
      this.modelSelectedAPI = {};
      this.currentEndpointByModel = {};
      this.allEndpointsByModel = [];
      this.allFieldsByReqDto = [];
      this.reqDtoModelMappedList = [];
      // this.selectedModelForDtoField = [];
    } else {
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          this.modelSelectedAPI = currDefination.properties['collection'];
          this.getTheReqDtos(this.modelSelectedAPI);

          this.currentEndpointByModel = currDefination.properties['endpoint'];
          this.endpointChange(this.currentEndpointByModel);

          this.reqDtoModelMappedList = currDefination.properties['mappedData'];
          this.selectedModelForDtoField = [];
          for (var j = 0; j < this.reqDtoModelMappedList.length; j++) {
            var newObj = this.reqDtoModelMappedList[j];
            this.selectedModelForDtoField.push(newObj.mappedModelField);
          }
        }
      }
    }
    this.apiEditor = editor;
    this.showAPIEditor = !this.showAPIEditor;
  }

  openSaveDataEditor(editor: any) {
    if (Object.keys(editor.step.properties).length === 0) {
      this.saveDataModel = {};
    } else {
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          this.saveDataModel = currDefination.properties['model'];
        }
      }
    }
    this.saveDataEditor = editor;
    this.showSaveDataEditor = !this.showSaveDataEditor;
  }

  openSetResponseDataEditor(editor: any) {
    // For New Entry Reseting the data
    if (Object.keys(editor.step.properties).length === 0) {
      this.selectedResPojo = {};
      this.pojoModelMappedList = [];
      this.selectedPojoFields = [];
    } else {
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];

        if (currDefination.id == editor.step.id) {
          this.selectedResPojo = currDefination.properties['pojo'];
          this.pojoModelMappedList = currDefination.properties['mappedData'];
          this.getPojoFields(this.selectedResPojo);
          this.selectedModelForsetResField = [];

          for (var j = 0; j < this.pojoModelMappedList.length; j++) {
            var newObj = this.pojoModelMappedList[j];
            this.selectedModelForsetResField.push(newObj.mappedModelField);
          }
        }
      }
    }
    this.setResDataEditor = editor;
    this.showSetResponseDataEditor = !this.showSetResponseDataEditor;
  }

  updateConditions() {
    // to handle this by partha
  }

  // New Code -------------------------------------------------------------------------------------------->

  selectedModels: Collection[] | any = [];
  currentModel: any;
  msSelected: MicroService = {};
  selectedOperation: any;
  selectedResOp: Collection | any = {};
  selectedDate: any;
  fieldArrays: Field[] = [];
  finalListModels: CollectionObj[] = [];
  saveDataModel: any = {}; // This is Collection
  selectedResPojo: any;
  selectedPojoFields: Field[] = [];

  selectedParams: InputParam[] | any = [{ dataType: '', varName: '' }];

  modelSelectedAPI: any;
  currentEndpointByModel: any;
  selectedModelForDtoField: Field[] = [];
  selectedModelForsetResField: Field[] = [];
  paramsForFetchData: any;
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
      .catch((err) => {});
  }

  getAllPojos() {
    this.businessLogicService
      .getPojosByMicroserivce(this.wf.microService?.id!)
      .then((res: any) => {
        this.allPojos = res;
      })
      .catch((err) => {});
  }

  // Save Models Code Start
  saveModels(editor: any) {
    this.updatePropertyCollection(
      editor.definition.properties,
      'collections',
      this.selectedModels,
      this.selectedParams,
      editor.context,
    );

    this.showModelsOptions = false;
  }

  saveParams(editor: any) {
    this.updatePropertyCollection(
      editor.definition.properties,
      'params',
      this.selectedModels,
      this.selectedParams,
      editor.context,
    );

    this.showParamsOptions = false;
  }

  deleteThisParams(index: any) {
    if (index >= 0 && index < this.selectedParams.length) {
      this.selectedParams.splice(index, 1);
    } else {
      console.error('Index out of bounds');
    }
  }

  public updatePropertyCollection(
    properties: Properties,
    name: string,
    selectedModels: any,
    selectedParams: InputParam[],
    context: GlobalEditorContext | StepEditorContext,
  ) {
    properties[name] = selectedModels;
    properties['schedule'] = this.selectedDate;
    properties['params'] = selectedParams;
    if (this.selectedResOp !== null && this.resType !== 'void') {
      properties['returnType'] = this.selectedResOp;
    } else if (this.resType === 'void') {
      properties['returnType'] = null;
    }

    context.notifyPropertiesChanged();
  }

  makeFieldListFromSelectedModel() {
    this.fieldArrays = [];
    var i = 0;
    this.finalListModels = [];
    // Loop through selectedModels
    for (let i = 0; i < this.selectedModels.length; i++) {
      const model = this.selectedModels[i];
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
  }

  // Fetch Data Code Start

  openFetchDataEditor(editor: any) {
    if (editor.step.properties.model?.id == null) {
      this.currentModel = {};
      this.selectedOperation = {};
      this.paramsForFetchData = {};
      this.customJPAQuery = {};
      this.fetchDataSchedule = null;
    } else {
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          this.currentModel = currDefination.properties['model'];
          this.selectedOperation = currDefination.properties['queryType'];
          this.paramsForFetchData = currDefination.properties['paramId'];
          this.customJPAQuery = currDefination.properties['customQuery'];
          this.fetchDataSchedule = parseISO(
            currDefination.properties['schedule']?.toString()
              ? currDefination.properties['schedule']?.toString()
              : '',
          );
        }
      }
    }
    this.fetchDataEditor = editor;
    this.showFetchDataPopup = !this.showFetchDataPopup;
  }

  saveFetchData(editor: any) {
    // this.sequence.find(item => item.type === "getDsData");

    this.saveInfoFetch(editor.step, editor.context);
  }

  public saveInfoFetch(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext,
  ) {
    // sequence = sequence.find((item: any) => item.type === 'getDsData');
    sequence.properties['model'] = this.currentModel;
    if (this.selectedOperation == 'CustomJpaQuery') {
      sequence.properties['queryType'] = this.selectedOperation;
      sequence.properties['customQuery'] = this.customJPAQuery;
      sequence.properties['paramId'] = 'null';
    } else if (this.selectedOperation == 'FindById') {
      sequence.properties['queryType'] = this.selectedOperation;
      sequence.properties['paramId'] = this.paramsForFetchData;
      sequence.properties['customQuery'] = 'null';
    } else {
      sequence.properties['queryType'] = this.selectedOperation;
      sequence.properties['customQuery'] = 'null';
      sequence.properties['paramId'] = 'null';
    }
    sequence.properties['schedule'] = this.fetchDataSchedule;

    context.notifyPropertiesChanged();
    this.showFetchDataPopup = false;
  }

  onSelectionChange(event: any) {}

  // Loop Code Start
  updateConditionsLoop(editor: any) {
    this.saveInfoLoop(editor.step, editor.context);

    this.showLoopEditor = false;
  }

  public saveInfoLoop(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext,
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
            operator: this.loopOperator,
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
    if (e == 'manual') {
      this.loopManualEntry = true;
    }
  }

  // If else condition code Start
  conditionGroups: any = [
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
    if (e === 'manual') {
      condition.manualEntry = true;
      condition.secondValue = null;
    } else {
      condition.manualEntry = false;
    }
  }

  updateIfConditions(editor: any) {
    this.saveIfConditions(editor.step, editor.context);

    this.showConditionEditor = false;
  }

  saveIfConditions(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext,
  ) {
    const payload = this.conditionGroups.map((group: any) => ({
      conditions: group.conditions,
      connector: group.connector,
    }));

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
    context: GlobalEditorContext | StepEditorContext,
  ) {
    // sequence = sequence.find((item: any) => item.type === 'saveDsData');
    sequence.properties['model'] = this.saveDataModel;
    context.notifyPropertiesChanged();
  }

  // Call Api code start
  updateApiEditor(editor: any) {
    this.saveThisAPICall(editor.step, editor.context);
    this.showAPIEditor = false;
  }

  reqDtoModelMappedList: any;
  currReqDtoModel!: reqDtoMappedModel;

  saveThisAPICall(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext,
  ) {
    // sequence = sequence.find((item: any) => item.type === 'callWebclient');

    sequence.properties['collection'] = this.modelSelectedAPI;
    sequence.properties['endpoint'] = this.currentEndpointByModel;
    sequence.properties['mappedData'] = this.reqDtoModelMappedList;
    context.notifyPropertiesChanged();
  }

  modelSelectedForReqDto(reqDtoField: any, modelSelected: any) {
    const existingIndex = this.reqDtoModelMappedList.findIndex(
      (item: any) => item.reqDtoField.id === reqDtoField.id,
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
      });
  }

  endpointChange(endpoint: any) {
    this.currentEndpointByModel = endpoint;
    if (endpoint !== null) {
      this.fieldsService
        .getFieldsByRequestDto(endpoint.requestDto?.id)
        .then((res: any) => {
          this.allFieldsByReqDto = res;
        });
    }
  }

  addParam() {
    this.selectedParams.push({});
  }

  // Set Response Pojo Code start

  pojoModelMappedList: any;
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
      (item: any) => item.pojoField.id === pojoField.id,
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
    this.saveThisSetResData(editor.step, editor.context);
    this.showSetResponseDataEditor = false;
  }

  saveThisSetResData(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext,
  ) {
    // sequence = sequence.find((item: any) => item.type === 'import');
    sequence.properties['pojo'] = this.selectedResPojo;
    sequence.properties['mappedData'] = this.pojoModelMappedList;
    context.notifyPropertiesChanged();
  }
}
