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
import { BusinessLogic, CollectionObj, Condition, InputParam, pojoMappedModel, reqDtoMappedModel } from '../business-logic/business-logic';
import { BusinessLogicService } from '../business-logic/business-logic.service';
import { DataFormService } from '../data-form/data-form.service';
import { LayoutService } from '../layout/layout.service';
import { GenericComponent } from '../utils/genericcomponent';
import { Actions, MappedParamsObj } from './action';
import { ActionService } from './action.service';
import { Collection } from '../collection/collection';
import { Endpoint } from '../collection/endpoints/endpoint';
import { Field } from '../fields/field';
import { FieldService } from '../fields/field.service';
import { ProjectService } from '../project/project.service';
import { EndpointService } from '../collection/endpoints/endpoint.service';
import { FilterBuilder } from '../utils/FilterBuilder';
import { MicroserviceService } from '../microservice/microservice.service';
import { MicroService } from '../microservice/microservice';
import { parseISO } from 'date-fns/parseISO';
import { ScreenService } from '../screen/screen.service';
import { PageParam, Screen } from '../screen/screen';

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
  // Old Code Start-------------------------------------

  // @ViewChild('canvas', { static: false }) public canvas!: ElementRef;
  // spacingx = 140;
  // spacingy = 40;
  // engine!: Engine;

  // actions: Action[] = [
  //   {
  //     type: '1',
  //     icon: 'assets/eye.svg',
  //     title: 'User Task',
  //     description: 'Triggers when somebody visits a specified page'
  //   },
  //   {
  //     type: '2',
  //     icon: 'assets/action.svg',
  //     title: 'Call Endpoint',
  //     description: 'Call a backend service and store response in variable'
  //   },
  //   {
  //     type: '3',
  //     icon: 'assets/time.svg',
  //     title: 'Wait',
  //     description: 'Triggers after a specified amount of time'
  //   },
  //   {
  //     type: '4',
  //     icon: 'assets/error.svg',
  //     title: 'Error prompt',
  //     description: 'Triggers when a specified error happens'
  //   },
  //   {
  //     type: '5',
  //     icon: 'assets/error.svg',
  //     title: 'Condition',
  //     description: 'If else condition'
  //   },
  //   {
  //     type: '5',
  //     icon: 'assets/error.svg',
  //     title: 'Loop',
  //     description: 'Loop on data'
  //   },
  //   {
  //     type: '5',
  //     icon: 'assets/error.svg',
  //     title: 'Show dialog',
  //     description: 'Show dialog'
  //   }
  // ];

  // initialData = {
  //   "html": "<div class=\"indicator invisible\"></div><div _ngcontent-lkj-c90=\"\" class=\"blockelem noselect block\" style=\"left: 3252px; top: 2665px;\"><input _ngcontent-lkj-c90=\"\" type=\"hidden\" name=\"blockelemtype\" class=\"blockelemtype\" value=\"1\"><input type=\"hidden\" name=\"blockid\" class=\"blockid\" value=\"0\"><div class=\"blockyleft\">\n    <img src=\"assets/eye.svg\">\n      <p class=\"blockyname\">User Task</p>\n    </div>\n    <div class=\"blockyright\">\n      <img src=\"assets/more.svg\">\n    </div>\n    <div class=\"blockydiv\"></div>\n    <div class=\"blockyinfo\">On click <span>new visitor</span> of a button <span>get data</span></div></div>",
  //   "blockarr": [
  //     {
  //       "parent": -1,
  //       "childWidth": 0,
  //       "id": 0,
  //       "x": 911,
  //       "y": 216.5,
  //       "width": 318,
  //       "height": 103
  //     }
  //   ],
  //   "blocks": [
  //     {
  //       "id": 0,
  //       "parent": -1,
  //       "data": [
  //         {
  //           "name": "blockelemtype",
  //           "value": "1"
  //         },
  //         {
  //           "name": "blockid",
  //           "value": "0"
  //         }
  //       ],
  //       "attr": [
  //         {
  //           "name": "_ngcontent-lkj-c90",
  //           "value": ""
  //         },
  //         {
  //           "name": "class",
  //           "value": "blockelem noselect block"
  //         },
  //         {
  //           "name": "style",
  //           "value": "left: 3252px; top: 2665px;"
  //         }
  //       ]
  //     }
  //   ]
  // };

  // // initialData = { blocks: [] };

  // ngAfterViewInit(): void {
  //   this.engine = new Engine(
  //     this.canvas.nativeElement,
  //     this.spacingx,
  //     this.spacingy,
  //     this.onGrab,
  //     this.onRelease,
  //     this.onSnap.bind(this)
  //   );
  //   if (this.initialData.blocks.length)
  //     this.engine.import(this.initialData);
  // }

  // onGrab(block: any) {

  // }
  // onRelease() {

  // }
  // onSnap(drag: any) {
  //   const grab = drag.querySelector('.grabme');
  //   grab.parentNode.removeChild(grab);
  //   const blockin = drag.querySelector('.blockin');
  //   blockin.parentNode.removeChild(blockin);
  //   drag.innerHTML += this.getPlacedElement(drag.querySelector('.blockelemtype').value);
  //   return true;
  // }

  // getPlacedElement(type: string) {
  //   const foundType = this.actions.find(action => action.type === type);
  //   return `<div class="blockyleft">
  //   <img src="${foundType!.icon}">
  //     <p class="blockyname">${foundType!.title}</p>
  //   </div>
  //   <div class="blockyright">
  //     <img src="assets/more.svg">
  //   </div>
  //   <div class="blockydiv"></div>
  //   <div class="blockyinfo">Call Api <span>for order</span> Api <span>endpoint</span></div>`;
  // }

  // getOutPut() {
  //   console.log(JSON.stringify(this.engine.output()));
  // }
  // Old Code Ends -------------------------------------

  // New Code Starts from here


  // New code


  data: Actions[] = [];
  componentName: string = 'Action Form';
  form!: FormGroup<any>;
  allActions: Actions[] = [];
  actionId: any;
  currentAction: Actions = {};
  actionData: Actions = {}
  currentMicroservice: MicroService = {};

  private designer?: Designer;
  projectId: any;

  public definition: Definition = createDefinition();
  public definitionJSON?: string;


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
  allMicroservice: MicroService[] = [];
  allPojos: [] = [];
  allScreens: Screen[] = [];

  showConditionEditor: boolean = false;
  showModelsOptions: boolean = false;
  showParamsOptions: boolean = false;
  navigatePopup: boolean = false;
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
  navigateDataEditor: any;
  setResDataEditor: any;
  navigateEditor: any;

  public readonly toolboxConfiguration: ToolboxConfiguration = {
    groups: [
      this.toolboxGroup('Main'),
    ],
  };

  public readonly stepsConfiguration: StepsConfiguration = {
    iconUrlProvider: (componentType, type) => `./assets/${type}.svg`,
    validator: () => true,
  };

  constructor(
    private businessLogicService: BusinessLogicService,
    private route: ActivatedRoute,
    private actionService: ActionService,
    private formService: DataFormService,
    private msgService: MessageService,
    private layoutService: LayoutService,
    private fb: FormBuilder,
    private router: Router,
    private microserivce: MicroserviceService,
    private screenService: ScreenService,
    private fieldsService: FieldService,
    private projectService: ProjectService,
    private endpointService: EndpointService
  ) {
    super(actionService, msgService);
    this.getAllMicroSerivices();
    this.form = this.fb.group({
      id: '',
      actionName: ['', Validators.required],
      actionType: ['', Validators.required],
      microService: [''],
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
          console.log(this.allMicroservice);
        });
      }
    });
  }

  public ngOnInit() {

    //   this.actionId = this.route.snapshot.paramMap.get('id');

    this.microserivce.getActiveMicroservice().subscribe((val: any) => {
      this.currentMicroservice = val;
      this.getActionsData();
    });

    // Code to get All the screens by Microservices Id
    const filterStr = FilterBuilder.equal('microService.id', this.currentMicroservice.id + '');
    this.search = filterStr;
    let pagination!: Pagination;

    this.screenService
      .getAllData(pagination, this.search)
      .then((res: any) => {
        this.allScreens = res.content;
      })
      .catch((err) => {
        console.log(err);
      });

    this.layoutService.checkPadding(false);

    this.updateDefinitionJSON();
    // this.businessLogicService.getData({ id: this.wfId }).then((res: any) => {
    //   if (res) {
    //     this.wf = res;
    //     this.dataDef = this.wf.workflowDefinition;
    //     if (this.dataDef) {
    //       this.definition = JSON.parse(this.dataDef);
    //       this.updateDefinitionJSON();
    //       this.populateEditorFormsData();
    //     }
    //     this.getAllModels();
    //     this.getAllPojos();
    //   }
    // });
  }

  getActionsData() {
    this.actionService.getAllActionsByMsId(this.currentMicroservice.id).then(
      (res) => {
        this.data = res;
        this.getActionContent();
      }
    ).catch(
      (err) => {
        console.log(err);
      }
    );
  }

  getActionContent() {
    this.actionId = this.route.snapshot.paramMap.get('id');

    if (this.actionId !== 'null') {
      this.actionService
        .getData({ id: this.actionId })
        .then((res: any) => {
          this.currentAction = res;
          this.dataDef = res.taskDefinition;

          if (this.dataDef !== null && this.dataDef !== undefined && this.dataDef !== 'null') {
            console.log('Working');
            console.log(this.currentAction);
            this.definition = JSON.parse(this.dataDef);
            this.updateDefinitionJSON();
            this.populateEditorFormsData();
          }
          else {
            console.log('Not working');
            // this.definition = JSON.parse(this.dataDef!);
            this.definition = createDefinition();
            this.updateDefinitionJSON();
            this.populateEditorFormsData();
          }
          this.getAllModels();
          this.getAllPojos();
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          this.currentAction = {};
          this.actionId = null;
        });
    } else {
      this.currentAction = {};
      this.actionId = null;
      // this.router.navigate(['/actions/' + null]);
      console.log('no active action found');
    }
  }

  getDataSorted() {
    return this.data.sort((a: any, b: any) =>
      a.actionName.localeCompare(b.actionName)
    );
  }

  openFormPopup() {
    this.form.reset();
    this.visible = true;
  }

  openCurrentAction(action: any) {
    this.currentAction = action;
    console.log(this.currentAction);
    this.router.navigate(['/actions/' + action.id]);
    setTimeout(() => {
      this.getActionContent();
    }, 1000);
  }

  getThisAction(actionId: any) {
    this.actionService
      .getActionByActionId(actionId)
      .then((res: any) => {
        if (res) {
          this.currentAction = res.content;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching this action.',
            life: 3000,
          });
        }
      })
      .catch((err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
          life: 3000,
        });
      });
  }

  hoverAction(actionType: string, action: any) {
    if (actionType == 'enter') {
      this.currentAction = action;
    } else {
      this.currentAction = {};
    }
  }

  override preSave() {
    if (this.currentMicroservice !== null) {
      this.form.value.microService = this.currentMicroservice;
    }
    else {
      this.form.value.microService = null;
    }
  }

  override postSave() {
    this.getActionsData();
  }


  // Sqd-desinger code same like services

  populateEditorFormsData() {
    console.log(this.definition.properties);
    if (this.definition.properties['collections'] == '') {
      this.selectedModels = [];
      this.finalListModels = [];
      this.selectedParams = [{ dataType: '', varName: '' }];
      this.selectedResOp = {};
      this.resType = null;
    }
    else {
      console.log('not empty');
      if (this.definition.properties['collections']) {
        this.selectedModels = this.definition.properties['collections'];
        this.makeFieldListFromSelectedModel();
      }
      else {
        this.selectedModels = [];
        this.finalListModels = [];
      }
      !this.definition.properties['returnType']
        ? (this.resType = 'void')
        : (this.resType = 'custom');

      this.definition.properties['returnType']
        ? (this.selectedResOp = this.definition.properties['returnType'])
        : this.selectedResOp = null;

      if (this.definition.properties['schedule']) {
        this.selectedDate = parseISO(
          this.definition.properties['schedule'].toString()
        );
      }

      this.selectedParams = this.definition.properties['params'] ? this.definition.properties['params'] : [{ dataType: '', varName: '' }];

      // TODO: Add other vatiables for step editor model forms

    }
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
        this.createTaskStepAPI(null, 'callWebclient', 'Call API', null),
        this.createFetchDataStep(null, 'getDsData', 'Navigate To', null),
        this.createIfStep(null, [], []),
        this.createContainerStep(null, []),
        this.createSaveDataTaskStep(null, 'saveDsData', 'Save data', null),
        // this.createSetResponseDataStep(
        //   null,
        //   'import',
        //   'Set Response Data',
        //   null
        // ),
      ],
    };
  }

  saveDefinition() {
    console.log(this.currentAction);
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
    this.actionId = this.route.snapshot.paramMap.get('id');

    if (this.actionId !== 'null') {
      this.actionService
        .getData({ id: this.actionId })
        .then((res: any) => {
          this.currentAction = res;
          this.currentAction.taskDefinition = this.definitionJSON;
        }
        )
    }
  }

  generateServiceCode() {
    this.updateDefinitionJSON();
    this.currentAction.taskDefinition = this.definitionJSON;
    this.actionService.generateServiceCode(this.currentAction).then((res: any) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Generated',
        detail: 'Code generated',
      });
    });
  }

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
  currentScreenToNavigate !: Screen;

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
  navigateToManualEntry: boolean = false;
  navigateToSecondValue: any;

  navigateToMappedData: Collection[] = [];


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
    else {
      console.log('Old');
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

    console.log(editor);
    if (Object.keys(editor.step.properties).length === 0) {
      console.log('New');
      this.loopFirstValue = {};
      this.loopOperator = {};
      this.loopSecondValue = {};
      this.loopStaticValue = null;
    }
    else {
      console.log('Old');
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          const logicGroup: any = currDefination.properties['conditionGroups'];

          logicGroup.forEach((group: any) => {
            // Loop through each condition within the group
            group.conditions.forEach((condition: any) => {
              console.log('condition');
              console.log(condition);
              this.loopFirstValue = condition.firstValue;
              this.loopOperator = condition.operator;
              if (condition.secondValue == 'manual') {
                this.loopStaticValue = condition.manualEntryValue;
                this.loopManualEntry = condition.manualEntry;
                this.loopSecondValue = 'manual';
              }
              else {
                this.loopSecondValue = condition.secondValue;
                this.loopStaticValue = null
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
    console.log(editor);
    // For New Entry Reseting the data
    if (editor.step.properties.collection == '' && editor.step.properties.endpoint == '') {
      console.log('New Entry');
      this.modelSelectedAPI = {};
      this.currentEndpointByModel = {};
      this.allEndpointsByModel = [];
      this.allFieldsByReqDto = [];
      this.reqDtoModelMappedList = [];
      // this.selectedModelForDtoField = [];
    }
    else {
      console.log('Old');
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];
        if (currDefination.id == editor.step.id) {
          console.log(currDefination);
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
    console.log(editor);
    if (Object.keys(editor.step.properties).length === 0) {
      console.log('New');
      this.saveDataModel = {};
    }
    else {
      console.log('Old');
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
    console.log(editor);
    // For New Entry Reseting the data
    if (Object.keys(editor.step.properties).length === 0) {
      console.log('New Entry');
      this.selectedResPojo = {};
      this.pojoModelMappedList = [];
      this.selectedPojoFields = [];
    }
    else {
      console.log('Old Entry');
      console.log(this.definition.sequence);
      for (var i = 0; i < this.definition.sequence.length; i++) {
        var currDefination = this.definition.sequence[i];
        console.log(currDefination);
        if (currDefination.id == editor.step.id) {
          console.log('Found');
          console.log(currDefination);
          this.selectedResPojo = currDefination.properties['pojo'];
          this.pojoModelMappedList = currDefination.properties['mappedData'];
          this.getPojoFields(this.selectedResPojo);
          this.selectedModelForsetResField = [];
          console.log('Final List');
          console.log(this.pojoModelMappedList);
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

  getAllModels() {
    this.businessLogicService
      .getModelsByMicroserivce(this.currentAction.microService?.id!)
      .then((res: any) => {
        this.allModels = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getAllPojos() {
    this.businessLogicService
      .getPojosByMicroserivce(this.currentAction.microService?.id!)
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

  deleteThisParams(index: any) {
    console.log(index);
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
    console.log(this.finalListModels);
  }

  // Navigate To Code Start

  selectTheScreen(screen: Screen) {
    this.currentScreenToNavigate = screen;
    // console.log( this.currentScreenToNavigate) ;
  }

  finalMappedParamsList: MappedParamsObj[] = [];

  mappedObjList: any
  openNavigateEditor(editor: any) {
    this.navigateEditor = editor;
    // Code for data population
    if (editor.step.properties?.screen == null) {
      console.log('New');
      this.currentScreenToNavigate = {};
      this.navigateToMappedData = [];
      this.finalMappedParamsList = [];
    }
    else {
      console.log('Old');
      this.currentScreenToNavigate = editor.step.properties.screen;
      this.mappedObjList = editor.step.properties.mappedData;
      this.finalMappedParamsList = editor.step.properties.mappedData;
      this.navigateToMappedData = [];
      console.log(this.mappedObjList);
      for (var i = 0; i < this.mappedObjList.length; i++) {
        var oneObj = this.mappedObjList[i];
        this.navigateToMappedData.push(oneObj.mappedValue);
      }
    }
    this.navigatePopup = !this.navigatePopup;
  }

  saveNavigateData(editor: any) {
    console.log(editor);
    this.saveNavigateInfo(editor.step, editor.context);
    this.navigatePopup = !this.navigatePopup;
  }

  isObjectEmpty(obj: any): boolean {
    //  console.log(obj && Object.keys(obj).length === 0) ;
    return obj && Object.keys(obj).length === 0;
  }

  public saveNavigateInfo(
    sequence: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    // sequence = sequence.find((item: any) => item.type === 'loop');
    sequence.properties['screen'] = this.currentScreenToNavigate;
    sequence.properties['mappedData'] = this.finalMappedParamsList;
    context.notifyPropertiesChanged();
  }

  handleValueChangesNavigate(e: any, pageParam: PageParam) {
    console.log(e);
    if (e == 'manual') {
      this.navigateToManualEntry = true;
    } else {
      console.log(this.finalMappedParamsList);
      const mappedObj = this.finalMappedParamsList.find((obj: any) => obj?.pageParam.id === pageParam.id);
      if (mappedObj !== null && mappedObj !== undefined) {
        mappedObj['mappedValue'] = e;
      }
      else {
        var newObj = {
          pageParam: pageParam,
          mappedValue: e
        }
        this.finalMappedParamsList.push(newObj);
      }
    }
  }


  handleManualValueChangesNavigate(e: any, pageParam: PageParam) {
    console.log(e);
   
      console.log(this.finalMappedParamsList);
      const mappedObj = this.finalMappedParamsList.find((obj: any) => obj?.pageParam.id === pageParam.id);
      if (mappedObj !== null && mappedObj !== undefined) {
        mappedObj['mappedValue'] = e;
      }
      else {
        var newObj = {
          pageParam: pageParam,
          mappedValue: e
        }
        this.finalMappedParamsList.push(newObj);
      }
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
    console.log(e);
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
    const payload = this.conditionGroups.map((group: any) => ({
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

  reqDtoModelMappedList: any;
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
      (item: any) => item.reqDtoField.id === reqDtoField.id
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
    console.log('firstCall');
    this.endpointService
      .getAllEndpointsByCollection(selectedModel.id)
      .then((res: any) => {
        this.allEndpointsByModel = res;
        console.log('current Endpoints of model');
      });
  }

  endpointChange(endpoint: any) {
    console.log('enP');
    console.log(endpoint);
    this.currentEndpointByModel = endpoint;
    if (endpoint !== null) {
      this.fieldsService
        .getFieldsByRequestDto(endpoint.requestDto?.id)
        .then((res: any) => {
          this.allFieldsByReqDto = res;
          console.log(this.allFieldsByReqDto);
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
      (item: any) => item.pojoField.id === pojoField.id
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


  navigateBack() {
    this.router.navigate(['/builder/microservices']);
  }
}
