import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
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
import { BusinessLogic } from '../business-logic';
import { BusinessLogicService } from '../business-logic.service';
import { GenericComponent } from '../../utils/genericcomponent';
import { Collection } from '../../collection/collection';
import { FormGroup } from '@angular/forms';
import { CollectionService } from '../../collection/collection.service';
import { sequence } from '@angular/animations';

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

  conditionEditor: any;
  constructor(
    private businessLogicService: BusinessLogicService,
    private route: ActivatedRoute,
    private msgService: MessageService,
    private collectionService: CollectionService
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
        this.createTaskStep(null, 'email', 'Send email', null),
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

  ModelEditor: any;
  openModelsPopup(editor: any) {
    this.showModelsOptions = !this.showModelsOptions;
    this.ModelEditor = editor;
  }

  updateConditions() {
    // to handle this by partha
  }

  // New Code
  selectedModels: Collection[] = [];
  currentModel: Collection = {};
  selectedOperation: any;
  selectedResOp : any;
  responseOtOptions = ["void", "custom"];
 
  getAllModels() {
    console.log('enter');
    this.getAllData();

    // setTimeout(() => {
    //   console.log(this.data[0].collectionName);
    // }, 5000);
  }

  saveModels(editor: any) {
    console.log(this.selectedModels);

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
    if( this.selectedResOp === 'custom' )
    {
      //  properties.returnType = {} ;
      properties['returnType']= [ 'firstName' , 'lastName']; // just for testing
     }
     else if(this.selectedResOp === 'void')
     {
      properties['returnType']= "void";
     }

    context.notifyPropertiesChanged();
  }

  saveFetchData(editor: any) {
    // this.sequence.find(item => item.type === "getDsData");
    this.saveInfo(editor.definition.sequence, editor.context);
  }

  public saveInfo(sequence: any, context: GlobalEditorContext | StepEditorContext) {
    sequence = sequence.find((item: any) => item.type === "getDsData");
    sequence.properties.stepName = this.currentModel.collectionName ;
    sequence.properties.expression = this.selectedOperation  ;
    context.notifyPropertiesChanged();
    this.showFetchDataPopup = false;
  }

  onSelectionChange(event: any) {
    console.log('Selected option:', this.selectedOperation);
  }
}
