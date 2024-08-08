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
import { BusinessLogic, Condition, ConditionGroup } from '../business-logic';
import { BusinessLogicService } from '../business-logic.service';
import { GenericComponent } from '../../utils/genericcomponent';
import { Collection } from '../../collection/collection';
import { FormGroup } from '@angular/forms';
import { CollectionService } from '../../collection/collection.service';
import { FieldService } from '../../fields/field.service';
import { FilterBuilder } from '../../utils/FilterBuilder';

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
  componentName: string = '';

  private designer?: Designer;

  public definition: Definition = createDefinition();
  public definitionJSON?: string;

  wfId: string | null = '';
  wf: BusinessLogic = {};
  dataDef: string | undefined = '';
  returnType = [
    { name: 'void', label: 'Nothing' },
    { name: 'Order', label: 'Order' },
  ];

  operators = [
    { name: '<', label: 'Less Than' },
    { name: '>', label: 'Greater Than' },
    { name: '=', label: 'Equal To' },
    { name: '~', label: 'Contains' },
  ];
  activeConditions: any[] = [];

  showConditionEditor: boolean = false;
  showModelsOptions: boolean = false;
  showFetchDataPopup: boolean = false;
  showLoopEditor: boolean = false;
  showAPIEditor : boolean =  false ;

  conditionEditor: any;
  ModelEditor: any;
  loopEditor: any;
  apiEditor: any;


  constructor(
    private businessLogicService: BusinessLogicService,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private collectionService: CollectionService,
    private fieldsService: FieldService
  ) {
    super(collectionService, msgService);
    this.getAllModels();
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
    this.getAllModels();
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
        this.createTaskStep(null, 'getDsData', 'Fetch Data', null),
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

  // New Code
  selectedModels: Collection[] = [];
  currentModel: Collection = {};
  selectedOperation: any;
  selectedResOp: any;
  responseOtOptions = ["void", "custom"];
  selectedDate: any;
  fieldArrays : string[] =[] ;

  loopFirstValue: any;
  loopOperator: any;
  loopSecondValue: any;
  loopStaticValue: any;

  getAllModels() {
    this.getAllData();
    // setTimeout(() => {
    //   console.log(this.data[0].collectionName);
    // }, 5000);
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
    selctedModels: any,
    context: GlobalEditorContext | StepEditorContext
  ) {
    properties[name] = selctedModels;
    properties['schedule'] = this.selectedDate;
    if (this.selectedResOp === 'custom') {

      var fieldsArray: string[] = [];
      var i = 0;
      for (i = 0; i < this.selectedModels.length; i++) {
        var filterStr = FilterBuilder.equal('collection.id', this.selectedModels[i].id + '');
        this.search = filterStr;
        var pagination !: Pagination;
        this.fieldsService.getAllData(pagination, this.search).then((res: any) => {
          for (var k = 0; k < res.content.length; k++) {
            fieldsArray.push(res.content[k].fieldName);
          }
        })
      }
      if (i === this.selectedModels.length) {
        properties['returnType'] = fieldsArray;
        this.fieldArrays = fieldsArray ;
        console.log(properties);
      }
    }
    else if (this.selectedResOp === 'void') {
      properties['returnType'] = "void";
    }
    context.notifyPropertiesChanged();
  }

  saveFetchData(editor: any) {
    // this.sequence.find(item => item.type === "getDsData");
    this.saveInfoFetch(editor.definition.sequence, editor.context);
  }

  public saveInfoFetch(sequence: any, context: GlobalEditorContext | StepEditorContext) {
    sequence = sequence.find((item: any) => item.type === "getDsData");
    sequence.properties.stepName = this.currentModel.collectionName;
    sequence.properties.expression = this.selectedOperation;
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
    sequence.properties['firstValue'] = this.loopFirstValue ;
    sequence.properties['operator'] = this.loopOperator ;
    sequence.properties['secondValue'] = this.loopSecondValue ;
    sequence.properties['staticValue'] = this.loopStaticValue ;
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
    group.conditions.push({ firstValue: '', operator: '=', secondValue: '' ,manualEntry: false });
  }

  // addCondition(groupIndex: number): void {
  //   this.conditionGroups[groupIndex].conditions.push({ firstValue: '', operator: '=', secondValue: '', manualEntry: false });
  // }

  removeCondition(groupIndex: number, conditionIndex: number): void {
    this.conditionGroups[groupIndex].conditions.splice(conditionIndex, 1);
    if (this.conditionGroups[groupIndex].conditions.length === 0) {
      this.conditionGroups[groupIndex].conditions.push({ firstValue: '', operator: '=', secondValue: '' , manualEntry: false});
    }
  }

  addConditionGroup(): void {
    const lastGroup = this.conditionGroups[this.conditionGroups.length - 1];
    lastGroup.connector = this.newConditionGroupConnector;
    this.conditionGroups.push({ conditions: [{ firstValue: '', operator: '=', secondValue: '', manualEntry: false  }] });
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

  saveIfConditions( sequence: any, context: GlobalEditorContext | StepEditorContext ){
    const payload = this.conditionGroups.map(group => ({
      conditions: group.conditions,
      connector: group.connector
    }));
    console.log('Payload:', JSON.stringify(payload));

    sequence = sequence.find((item: any) => item.type === "if");
    sequence.properties['conditionDefination'] = JSON.stringify(payload) ;
    context.notifyPropertiesChanged();
  }

  // Code for API step editor
  updateApiEditor(editor : any)
  {

  }
}
