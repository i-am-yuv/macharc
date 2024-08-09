import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, Pagination } from '@splenta/vezo/src/public-api';
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
import { BusinessLogic, CollectionObj, Condition, ConditionGroup } from '../business-logic';
import { BusinessLogicService } from '../business-logic.service';
import { GenericComponent } from '../../utils/genericcomponent';
import { Collection } from '../../collection/collection';
import { FormGroup } from '@angular/forms';
import { CollectionService } from '../../collection/collection.service';
import { FieldService } from '../../fields/field.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { MicroService } from '../../microservice/microservice';
import { MicroserviceService } from '../../microservice/microservice.service';
import { ProjectService } from '../../project/project.service';
import { Field } from '../../fields/field';

function createDefinition() {
  return {
    properties: {
      collections: '',
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
export class BusinessLogicDesignerComponent extends GenericComponent implements OnInit {

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

  operators = [
    { name: '<', label: 'Less Than' },
    { name: '>', label: 'Greater Than' },
    { name: '==', label: 'Equal To' },
    { name: '!=', label: 'Not Equal To' },
    { name: '<=', label: 'Less Than Or Equal To' },
    { name: '>=', label: 'Greater Than Or Equal To' },
    { name: '~', label: 'Contains' },
  ];

  operations = [
    { name: 'Find all', label: 'FindAll' },
    { name: 'Find one', label: 'FindOne' },
    { name: 'Find by an Id', label: 'FindById' },
    { name: 'Custom JPA query', label: 'CustomJpaQuery' },
  ];
  activeConditions: any[] = [];
  allModels: Collection[] = [];
  allPojos: [] = [];

  showConditionEditor: boolean = false;
  showModelsOptions: boolean = false;
  showFetchDataPopup: boolean = false;
  showLoopEditor: boolean = false;
  showAPIEditor: boolean = false;

  conditionEditor: any;
  ModelEditor: any;
  loopEditor: any;
  apiEditor: any;


  constructor(
    private businessLogicService: BusinessLogicService,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private collectionService: CollectionService,
    private microserivce: MicroserviceService,
    private fieldsService: FieldService,
    private projectService: ProjectService
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
        var pagination !: Pagination;
        this.microserivce.getAllData(pagination, this.search).then(
          (res) => {
            this.allMicroservice = res.content;
            console.log(this.allMicroservice);
          }
        );
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
        }
        this.getAllModels();
        this.getAllPojos();
      }
    });
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
  createTaskStep(
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
      properties: properties || { velocity: 0, stepName: name, expression: '' },
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
      properties: properties || { schedule: 0, model: name, queryType: '', customQuery: 'null' },
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
        this.createTaskStep(null, 'callWebclient', 'Call APIS', null),
        this.createTaskStep(null, 'saveDsData', 'Save data', null),
        // this.createTaskStep(null, 'responseOutput', 'Response Output', null),
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
    this.showConditionEditor = !this.showConditionEditor;
    this.conditionEditor = editor;
  }
  openLoopEditor(editor: any) {
    this.showLoopEditor = !this.showLoopEditor;
    this.loopEditor = editor;
  }

  openModelsPopup(editor: any) {
    this.showModelsOptions = !this.showModelsOptions;
    this.ModelEditor = editor;
  }

  openAPIEditor(editor: any) {
    this.showAPIEditor = !this.showAPIEditor;
    this.apiEditor = editor;
  }

  updateConditions() {
    // to handle this by partha
  }

  // New Code -------------------------------------------------------------------------------------------->

  selectedModels: Collection[] = [];
  currentModel: Collection = {};
  msSelected: MicroService = {};
  selectedOperation: any;
  selectedResOp: Collection = {};
  selectedDate: any;
  fieldArrays: Field[] = [];
  finalListModels: CollectionObj[] = [];

  loopFirstValue: any;
  loopOperator: any;
  loopSecondValue: any;
  loopStaticValue: any;
  resType: any;
  fetchDataSchedule: any;
  customJPAQuery: any;

  getAllModels() {

    this.businessLogicService.getModelsByMicroserivce(this.wf.microService?.id!).then((res: any) => {
      this.allModels = res;
    }).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  getAllPojos() {
    this.businessLogicService.getPojosByMicroserivce(this.wf.microService?.id!).then((res: any) => {
      this.allPojos = res;
    }).catch(
      (err) => {
        console.log(err);
      }
    )
  }

  saveModels(editor: any) {
    this.updatePropertyCollection(
      editor.definition.properties,
      'collections',
      this.selectedModels,
      editor.context
    );

    this.showModelsOptions = false;
  }

  public updatePropertyCollection(
    properties: Properties,
    name: string,
    selectedModels: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    properties[name] = selectedModels;
    properties['schedule'] = this.selectedDate;
    if (this.selectedResOp !== null && this.resType !== 'void') {
      properties['returnType'] = this.selectedResOp;
    }
    else if (this.resType === 'void') {
      properties['returnType'] = "void";
    }

    this.fieldArrays = [];
    var i = 0;
    // console.log( this.selectedModels);
    // for (i = 0; i < selectedModels.length; i++) {
    //   var filterStr = FilterBuilder.equal('collection.id', this.selectedModels[i].id + '');
    //   this.search = filterStr;
    //   var pagination !: Pagination;
    //   this.fieldsService.getAllData(pagination, this.search).then((res: any) => {
    //     for (var k = 0; k < res.content.length; k++) {
    //       this.fieldArrays.push(res.content[k]);
    //     }
    //   })
    // }

    // for (let i = 0; i < selectedModels.length; i++) {
    //   const model = selectedModels[i];
    //   const filterStr = FilterBuilder.equal('collection.id', model.id + '');
    //   this.search = filterStr;
    //   let pagination!: Pagination;

    //   this.fieldsService.getAllData(pagination, this.search).then((res: any) => {
    //     // const items = res.content.map((field: any) => field);
    //     const items = res.content.map((field: any) => ({
    //       fieldName: field.fieldName,
    //       value: field.id
    //     }));

    //     const collectionObj = {
    //       fieldName: model.collectionName, 
    //       value: model.id, // CollectionId
    //       items: items // Field objects
    //     };
    //     this.finalListModels.push(collectionObj);
    //   });
    // }

    // Loop through selectedModels
  for (let i = 0; i < selectedModels.length; i++) {
    const model = selectedModels[i];
    const filterStr = FilterBuilder.equal('collection.id', model.id + '');
    this.search = filterStr;
    let pagination!: Pagination;

    this.fieldsService.getAllData(pagination, this.search).then((res: any) => {
      const items = res.content.map((field: any) => ({
        label: field.fieldName, 
        value: field        
      }));

      const collectionObj = {
        label: model.collectionName, 
        value: model,             
        items: items                
      };
      this.finalListModels.push(collectionObj);
    });
  }
    console.log( this.finalListModels) ;
    context.notifyPropertiesChanged();
  }

  saveFetchData(editor: any) {
    // this.sequence.find(item => item.type === "getDsData");
    this.saveInfoFetch(editor.definition.sequence, editor.context);
  }

  public saveInfoFetch(sequence: any, context: GlobalEditorContext | StepEditorContext) {
    sequence = sequence.find((item: any) => item.type === "getDsData");
    sequence.properties.model = this.currentModel.collectionName;
    if (this.selectedOperation == 'CustomJpaQuery') {
      sequence.properties.queryType = this.selectedOperation;
      sequence.properties.customQuery = this.customJPAQuery;
    }
    else {
      sequence.properties.queryType = this.selectedOperation;
      sequence.properties.customQuery = "null";
    }
    sequence.properties.schedule = this.fetchDataSchedule;

    context.notifyPropertiesChanged();
    this.showFetchDataPopup = false;
  }

  onSelectionChange(event: any) {
    console.log('Selected option:', this.selectedOperation);
  }

  updateConditionsLoop(editor: any) {
    console.log(editor);
    this.saveInfoLoop(
      editor.definition.sequence,
      editor.context
    );

    this.showLoopEditor = false;
  }

  public saveInfoLoop(sequence: any, context: GlobalEditorContext | StepEditorContext) {
    sequence = sequence.find((item: any) => item.type === "loop");
    sequence.properties['firstValue'] = this.loopFirstValue;
    sequence.properties['operator'] = this.loopOperator;
    sequence.properties['secondValue'] = this.loopSecondValue;
    sequence.properties['staticValue'] = this.loopStaticValue;
    context.notifyPropertiesChanged();
  }

  // if else condition code

  conditionGroups: ConditionGroup[] = [
    { conditions: [{ firstValue: '', operator: '=', secondValue: '', manualEntry: false }] }
  ];
  newConditionGroupConnector: string = 'AND';

  getDropdownOptions() {
    return [{ label: 'Enter Manually', value: 'manual' }, ...this.fieldArrays];
  }

  addCondition(groupIndex: number): void {
    const group = this.conditionGroups[groupIndex];
    if (group.conditions.length > 0) {
      group.conditions[group.conditions.length - 1].connector = group.connector || 'AND';
    }
    group.conditions.push({ firstValue: '', operator: '=', secondValue: '', manualEntry: false });
  }

  // addCondition(groupIndex: number): void {
  //   this.conditionGroups[groupIndex].conditions.push({ firstValue: '', operator: '=', secondValue: '', manualEntry: false });
  // }

  removeCondition(groupIndex: number, conditionIndex: number): void {
    this.conditionGroups[groupIndex].conditions.splice(conditionIndex, 1);
    if (this.conditionGroups[groupIndex].conditions.length === 0) {
      this.conditionGroups[groupIndex].conditions.push({ firstValue: '', operator: '=', secondValue: '', manualEntry: false });
    }
  }

  addConditionGroup(): void {
    const lastGroup = this.conditionGroups[this.conditionGroups.length - 1];
    lastGroup.connector = this.newConditionGroupConnector;
    this.conditionGroups.push({ conditions: [{ firstValue: '', operator: '=', secondValue: '', manualEntry: false }] });
  }

  handleSecondValueChange(condition: Condition, value: string): void {
    if (value === 'manual') {
      condition.manualEntry = true;
      condition.secondValue = '';
    } else {
      condition.manualEntry = false;
    }
  }

  updateIfConditions(editor: any) {
    console.log(editor);
    this.saveIfConditions(
      editor.definition.sequence,
      editor.context
    );

    this.showConditionEditor = false;
  }

  saveIfConditions(sequence: any, context: GlobalEditorContext | StepEditorContext) {
    const payload = this.conditionGroups.map(group => ({
      conditions: group.conditions,
      connector: group.connector
    }));
    console.log('Payload:', JSON.stringify(payload));

    sequence = sequence.find((item: any) => item.type === "if");
    sequence.properties['conditionDefination'] = payload;
    context.notifyPropertiesChanged();
  }

  // Code for API step editor
  updateApiEditor(editor: any) {
    console.log(this.msSelected);
  }
}