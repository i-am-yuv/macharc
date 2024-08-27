import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, Pagination } from '@splenta/vezo';
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
import { Application } from '../application/application';
import { ApplicationService } from '../application/application.service';
import {
  ActionVariable,
  CollectionObj,
  Condition,
  InputParam,
  pojoMappedModel,
  reqDtoMappedModel,
} from '../business-logic/business-logic';
import { BusinessLogicService } from '../business-logic/business-logic.service';
import { Collection } from '../collection/collection';
import { CollectionService } from '../collection/collection.service';
import { Endpoint } from '../collection/endpoints/endpoint';
import { EndpointService } from '../collection/endpoints/endpoint.service';
import { DataFormService } from '../data-form/data-form.service';
import { Field } from '../fields/field';
import { FieldService } from '../fields/field.service';
import { LayoutService } from '../layout/layout.service';
import { MicroService } from '../microservice/microservice';
import { MicroserviceService } from '../microservice/microservice.service';
import { ProjectService } from '../project/project.service';
import { PageParam, Screen } from '../screen/screen';
import { ScreenService } from '../screen/screen.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericComponent } from '../utils/genericcomponent';
import { Actions, MappedParamsObj } from './action';
import { ActionService } from './action.service';
import { DataHandler } from './DataHandler';
import { OpenEditor } from './OpenEditor';
import { ToolBoxMethods } from './toolBoxMethods';

export interface Action {
  type: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent extends GenericComponent implements OnInit {
  data: Actions[] = [];
  componentName: string = 'Action Form';
  form!: FormGroup<any>;
  allActions: Actions[] = [];
  actionId: any;
  currentAction: Actions = {};
  actionData: Actions = {};

  designer?: Designer;
  projectId: any;

  definition: Definition = this.createDefinition();
  definitionJSON?: string;

  dataDef: string | undefined = '';
  returnType = [
    { name: 'void', label: 'void' },
    { name: 'custom', label: 'custom' },
  ];

  dataTypes = [
    { name: 'string', label: 'String' },
    { name: 'number', label: 'Number' },
    { name: 'any', label: 'Any' },
    { name: 'boolean', label: 'Boolean' },
    { name: 'Model', label: 'Model' },
    { name: 'Field', label: 'Field' },
  ];

  paramDataTypes = [
    { name: 'string', label: 'String' },
    { name: 'number', label: 'Number' },
    { name: 'any', label: 'Any' },
    { name: 'boolean', label: 'Boolean' },
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
  allModels: any = {};
  allEndpointsByModel: Endpoint[] = [];
  allFieldsByModel: Field[] = [];
  allFieldsByReqDto: Field[] = [];
  allMicroservice: MicroService[] = [];
  allPojos: [] = [];
  allScreens: Screen[] = [];

  showConditionEditor: boolean = false;
  showVariablesOptions: boolean = false;
  showParamsOptions: boolean = false;
  navigatePopup: boolean = false;
  showLoopEditor: boolean = false;
  showAPIEditor: boolean = false;
  showSaveDataEditor: boolean = false;
  showSetResponseDataEditor: boolean = false;

  conditionEditor: any;
  VariablesEditor: any;
  loopEditor: any;
  apiEditor: any;
  paramsEditor: any;
  saveDataEditor: any;
  navigateDataEditor: any;
  setResDataEditor: any;
  navigateEditor: any;

  reqDtoModelMappedList: any[] = [];
  currReqDtoModel!: reqDtoMappedModel;

  createDefinition() {
    return {
      properties: {
        variables: '',
        params: '',
      },
      sequence: [],
    };
  }
  readonly toolboxConfiguration: ToolboxConfiguration = {
    groups: [this.toolboxGroup('Main')],
  };

  readonly stepsConfiguration: StepsConfiguration = {
    iconUrlProvider: (componentType, type) => `./assets/${type}.svg`,
    validator: () => true,
  };
  currentApplication: Application = {};
  requestDto: any;
  responseDto: any;

  ////////////

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
  currentScreenToNavigate!: Screen;

  selectedParams: InputParam[] | any = [{ dataType: '', varName: '' }];
  selectedVariables: ActionVariable[] | any = [{ dataType: '', varName: '' }];

  modelSelectedAPI: any;
  selectedMicroserviceAPI: any = {};
  currentEndpointByModel: any;
  selectedModelForDtoField: Field[] = [];
  manualEntryAPIStates: boolean[] = [];

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
  navigateToManualEntry: boolean = false;
  navigateToSecondValue: any;

  navigateToMappedData: Collection[] = [];
  manualEntryStates: boolean[] = [];

  constructor(
    public businessLogicService: BusinessLogicService,
    public route: ActivatedRoute,
    public actionService: ActionService,
    public formService: DataFormService,
    public msgService: MessageService,
    public layoutService: LayoutService,
    public fb: FormBuilder,
    public router: Router,
    public microserivce: MicroserviceService,
    public screenService: ScreenService,
    public fieldsService: FieldService,
    public projectService: ProjectService,
    public endpointService: EndpointService,
    public applicationService: ApplicationService,
    public collectionService: CollectionService,
    public screensService: ScreenService,
  ) {
    super(actionService, msgService);
    this.getAllMicroSerivices();
    this.form = this.fb.group({
      id: '',
      actionName: ['', Validators.required],
      actionType: ['', Validators.required],
      application: [{}],
      actionTasks: [''],
    });
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

  public ngOnInit() {
    this.actionId = this.route.snapshot.paramMap.get('id');

    this.applicationService.getActiveApplication().subscribe((app: any) => {
      this.currentApplication = app;
      this.getAllActions(app);
      this.getAllScreens(app);
    });
    if (this.actionId) {
      this.getActionContent();
    }
    this.layoutService.checkPadding(false);
  }

  getActionContent() {
    DataHandler.getActionContent(this);
  }

  getThisAction(actionId: any) {
    DataHandler.getThisAction(this, actionId);
  }

  getDataSorted() {
    return this.data.sort((a: any, b: any) =>
      a.actionName.localeCompare(b.actionName),
    );
  }

  openFormPopup() {
    this.form.reset();
    this.visible = true;
  }

  openCurrentAction(action: any) {
    this.currentAction = action;
    this.router.navigate(['/builder/actions/designer/' + action.id]);
  }

  hoverAction(actionType: string, action: any) {
    if (actionType == 'enter') {
      this.currentAction = action;
    } else {
      this.currentAction = {};
    }
  }

  override preSave() {
    if (this.currentApplication !== null) {
      this.form.value.application = this.currentApplication;
    } else {
      this.form.value.application = null;
    }
  }

  override postSave() {
    this.getAllActions(this.currentApplication);
  }

  // Sqd-desinger code same like services

  // Load data from defintion
  populateEditorFormsData() {
    if (this.definition.properties['variables'] == '') {
      this.selectedVariables = [{ dataType: '', varName: '' }];
    } else {
      if (this.definition.properties['variables']) {
        this.selectedVariables = this.definition.properties['variables'];
        this.selectedVariables.forEach((e: any) => {
          this.getAllModels(e, e.microServiceId);
          this.getTheFields(e, e.modelId);
        });
      } else {
        this.selectedVariables = [{ dataType: '', varName: '' }];
      }
    }
    if (this.definition.properties['params'] == '') {
      this.selectedParams = [{ dataType: '', varName: '' }];
    } else {
      if (this.definition.properties['params']) {
        this.selectedParams = this.definition.properties['params'];
        this.selectedParams.forEach((e: any) => {
          this.getAllModels(e, e.microServiceId);
        });
      } else {
        this.selectedParams = [{ dataType: '', varName: '' }];
      }
    }
  }

  onDesignerReady(designer: Designer) {
    this.designer = designer;
  }

  onDefinitionChanged(definition: Definition) {
    this.definition = definition;
    this.updateDefinitionJSON();
  }

  updateName(step: Step, event: Event, context: StepEditorContext) {
    step.name = (event.target as HTMLInputElement).value;
    context.notifyNameChanged();
  }

  updateProperty(
    properties: Properties,
    name: string,
    event: Event,
    context: GlobalEditorContext | StepEditorContext,
  ) {
    properties[name] = (event.target as HTMLInputElement).value;
    context.notifyPropertiesChanged();
  }

  reloadDefinitionClicked() {
    this.definition = this.createDefinition();
    this.updateDefinitionJSON();
  }

  updateDefinitionJSON() {
    this.definitionJSON = JSON.stringify(this.definition, null, 2);
  }

  toolboxGroup(name: any) {
    return {
      name,
      steps: [
        // this.createImportStep(null, 'import', 'Import Models', null),
        ToolBoxMethods.createTaskStepAPI(
          null,
          'callWebclient',
          'Call API',
          null,
        ),

        ToolBoxMethods.createSaveDataTaskStep(
          null,
          'saveToVariable',
          'Assign to variable',
          null,
        ),
        ToolBoxMethods.navigateTo(null, 'navigateTo', 'Navigate To', null),
        ToolBoxMethods.createIfStep(null, [], []),
        ToolBoxMethods.createContainerStep(null, []),
        ToolBoxMethods.createNotification(
          null,
          'notification',
          'Notification',
          null,
        ),
      ],
    };
  }

  saveDefinition() {
    //
    if (this.currentAction.id == null) {
      this.getActionContent();
    }
    this.currentAction.taskDefinition = this.definitionJSON;
    this.actionService.updateData(this.currentAction).then((res: any) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Definition updated',
      });
    });
  }

  getCurrentAction() {
    DataHandler.getCurrentAction(this);
  }

  generateServiceCode() {
    DataHandler.generateServiceCode(this);
  }

  openConditionEditor(editor: any) {
    OpenEditor.openConditionEditor(this, editor);
  }
  openLoopEditor(editor: any) {
    OpenEditor.openLoopEditor(this, editor);
  }

  openVariablesPopup(editor: any) {
    OpenEditor.openVariablesPopup(this, editor);
  }

  openParamsPopup(editor: any) {
    OpenEditor.openParamsPopup(this, editor);
  }
  openAPIEditor(editor: any) {
    OpenEditor.openAPIEditor(this, editor);
  }
  openSaveDataEditor(editor: any) {
    OpenEditor.openSaveDataEditor(this, editor);
  }
  openSetResponseDataEditor(editor: any) {
    OpenEditor.openSetResponseDataEditor(this, editor);
  }

  openNavigateEditor(editor: any) {
    OpenEditor.openNavigateEditor(this, editor);
  }

  updateConditions() {
    // TODO: to handle this by partha
  }

  getAllScreens(app: Application) {
    DataHandler.getAllScreens(this, app);
  }

  getAllActions(app: Application) {
    DataHandler.getAllActions(this, app);
  }

  getAllModels(selectedVar: any, msId: string) {
    DataHandler.getAllModels(this, selectedVar, msId);
  }

  getAllPojos() {
    DataHandler.getAllPojos(this);
  }

  // Save Models Code Start
  saveVariables(editor: any) {
    this.selectedVariables.forEach((e: any) => {
      delete e.microService;
      delete e.allModels;
      delete e.allFieldsByModel;
    });

    this.updatePropertyVariables(
      editor.definition.properties,
      'variables',
      this.selectedVariables,
      editor.context,
    );

    this.showVariablesOptions = false;
  }

  saveParams(editor: any) {
    this.selectedParams.forEach((e: any) => {
      delete e.microService;
      delete e.allModels;
    });
    this.updatePropertyVariables(
      editor.definition.properties,
      'params',
      this.selectedParams,
      editor.context,
    );

    this.showParamsOptions = false;
  }

  deleteThisVariable(index: any) {
    //
    if (index >= 0 && index < this.selectedVariables.length) {
      this.selectedVariables.splice(index, 1);
    } else {
      console.error('Index out of bounds');
    }
  }

  cleanUpVariable(variable: any) {
    delete variable.allModels;
    delete variable.allFieldsByModel;
  }

  deleteThisParams(index: any) {
    //
    if (index >= 0 && index < this.selectedParams.length) {
      this.selectedParams.splice(index, 1);
    } else {
      console.error('Index out of bounds');
    }
  }

  updatePropertyCollection(
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

  updatePropertyVariables(
    properties: Properties,
    name: string,
    selectedVariables: ActionVariable[],
    context: GlobalEditorContext | StepEditorContext,
  ) {
    properties[name] = selectedVariables;
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
    //
  }

  // Navigate To Code Start

  selectTheScreen(screen: Screen) {
    this.currentScreenToNavigate = screen;
  }

  finalMappedParamsList: MappedParamsObj[] = [];

  mappedObjList: any;

  saveNavigateData(editor: any) {
    //
    this.saveNavigateInfo(editor.step, editor.context);
    this.navigatePopup = !this.navigatePopup;
  }

  isObjectEmpty(obj: any): boolean {
    return obj && Object.keys(obj).length === 0;
  }

  public saveNavigateInfo(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext,
  ) {
    sequence.properties['screen'] = this.currentScreenToNavigate;
    sequence.properties['mappedData'] = this.finalMappedParamsList;
    context.notifyPropertiesChanged();
  }

  handleValueChangesNavigate(e: any, pageParam: PageParam, index: number) {
    if (e === 'manual') {
      this.manualEntryStates[index] = true;
    } else {
      this.manualEntryStates[index] = false;
      const mappedObj = this.finalMappedParamsList.find(
        (obj: any) => obj?.pageParam.id === pageParam.id,
      );
      if (mappedObj) {
        mappedObj['mappedValue'] = e;
      } else {
        this.finalMappedParamsList.push({
          pageParam: pageParam,
          mappedValue: e,
        });
      }
    }
  }

  handleManualValueChangesNavigate(
    e: any,
    pageParam: PageParam,
    index: number,
  ) {
    const mappedObj = this.finalMappedParamsList.find(
      (obj: any) => obj?.pageParam.id === pageParam.id,
    );
    if (mappedObj) {
      mappedObj['mappedValue'] = e;
    } else {
      this.finalMappedParamsList.push({
        pageParam: pageParam,
        mappedValue: e,
      });
    }
  }

  toggleManualEntry(index: number) {
    this.manualEntryStates[index] = !this.manualEntryStates[index];
  }

  // Loop Code Start
  updateConditionsLoop(editor: any) {
    //
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
    //
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
    console.log(this.requestDto);
    this.saveThisAPICall(editor.step, editor.context);
    this.showAPIEditor = false;
  }

  saveThisAPICall(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext,
  ) {
    // sequence = sequence.find((item: any) => item.type === 'callWebclient');
    sequence.properties['microServiceId'] = this.selectedMicroserviceAPI;
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

  getTheDtos(selectedModel: string) {
    console.log(selectedModel);
    DataHandler.getTheDtos(this, selectedModel);
  }

  getTheFields(selectedVar: any, selectedModelId: string) {
    DataHandler.getTheFields(this, selectedVar, selectedModelId);
  }

  // endpointChange(endpoint: any) {
  //   this.currentEndpointByModel = endpoint;
  //   if (endpoint !== null) {
  //     this.fieldsService
  //       .getFieldsByRequestDto(endpoint.requestDto?.id)
  //       .then((res: any) => {
  //         this.allFieldsByReqDto = res;
  //       });
  //   }
  // }

  addParam() {
    this.selectedParams.push({});
  }

  addVariable() {
    this.selectedVariables.push({});
  }

  handleValueChangesAPI(e: any, reqDtoField: any, index: number) {
    if (e === 'manual') {
      this.manualEntryAPIStates[index] = true;
    } else {
      this.manualEntryAPIStates[index] = false;
      const mappedObj = this.reqDtoModelMappedList.find(
        (obj: any) => obj?.reqDtoField.id === reqDtoField.id,
      );
      if (mappedObj) {
        mappedObj['mappedModelField'] = e;
      } else {
        this.reqDtoModelMappedList.push({
          reqDtoField: reqDtoField,
          mappedModelField: e,
        });
      }
    }
  }

  handleManualValueChangesAPI(e: any, reqDtoField: any, index: number) {
    const mappedObj = this.reqDtoModelMappedList.find(
      (obj: any) => obj?.reqDtoField.id === reqDtoField.id,
    );
    if (mappedObj) {
      mappedObj['mappedModelField'] = e;
    } else {
      this.reqDtoModelMappedList.push({
        reqDtoField: reqDtoField,
        mappedModelField: e,
      });
    }
  }

  toggleManualEntryAPI(index: number) {
    this.manualEntryAPIStates[index] = !this.manualEntryAPIStates[index];
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
      this.search = '';
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
    sequence.properties['pojo'] = this.selectedResPojo;
    sequence.properties['mappedData'] = this.pojoModelMappedList;
    context.notifyPropertiesChanged();
  }

  navigateBack() {
    this.router.navigate(['/applications']);
  }
}
