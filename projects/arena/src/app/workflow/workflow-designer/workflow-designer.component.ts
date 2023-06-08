import { Component, OnInit } from '@angular/core';
import { Definition, Designer, GlobalEditorContext, Properties, Step, StepEditorContext, StepsConfiguration, ToolboxConfiguration } from 'sequential-workflow-designer';
import { WorkflowService } from '../workflow.service';
import { ActivatedRoute } from '@angular/router';
import { Workflow } from '../workflow';
import { MessageService } from '@splenta/vezo';
function createDefinition() {
  return {
    properties: {
      collections: '',
      velocity: 0,
      returnType: 'void',
    },
    sequence: []
  };
}
@Component({
  selector: 'app-workflow-designer',
  templateUrl: './workflow-designer.component.html',
  styleUrls: ['./workflow-designer.component.scss']
})
export class WorkflowDesignerComponent implements OnInit {

  private designer?: Designer;

  public definition: Definition = createDefinition();
  public definitionJSON?: string;

  wfId: string | null = '';
  wf: Workflow = {};
  dataDef: string | undefined = '';
  constructor(
    private workflowService: WorkflowService,
    private route: ActivatedRoute,
    private msgService: MessageService,
  ) {

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
      this.toolboxGroup('Main')

    ]
  };
  public readonly stepsConfiguration: StepsConfiguration = {
    iconUrlProvider: (componentType, type) => `./assets/${type}.svg`,
    validator: () => true
  };

  public ngOnInit() {
    this.updateDefinitionJSON();
    this.wfId = this.route.snapshot.paramMap.get('id');
    this.workflowService.getData({ id: this.wfId }).then(
      (res: any) => {
        if (res) {
          this.wf = res;
          this.dataDef = this.wf.workflowDefinition;
          if (this.dataDef) {
            this.definition = JSON.parse(this.dataDef);
            this.updateDefinitionJSON();
          }
        }
      })
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

  public updateProperty(properties: Properties, name: string, event: Event, context: GlobalEditorContext | StepEditorContext) {
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
  createTaskStep(id: null, type: string, name: string, properties: any | undefined) {
    return {
      id,
      componentType: 'task',
      type,
      name,
      properties: properties || { velocity: 0, expression: '' }
    };
  }
  createIfStep(id: null, _true: never[], _false: never[]) {
    return {
      id,
      componentType: 'switch',
      type: 'if',
      name: 'If',
      branches: {
        'true': _true,
        'false': _false
      },
      properties: {}
    };
  }

  createContainerStep(id: any, steps: any) {
    return {
      id,
      componentType: 'container',
      type: 'loop',
      name: 'Loop',
      properties: {},
      sequence: steps
    };
  }
  toolboxGroup(name: any) {
    return {
      name,
      steps: [
        this.createTaskStep(null, 'task', 'Task', null),
        this.createIfStep(null, [], []),
        this.createContainerStep(null, []),
        this.createTaskStep(null, 'text', 'Send email', null),
        this.createTaskStep(null, 'save', 'Save data', null),
      ]
    };
  }

  saveDefinition() {
    this.wf.workflowDefinition = this.definitionJSON;
    this.workflowService.updateData(this.wf).then((res: any) => {
      this.msgService.add({ severity: 'success', summary: 'Updated', detail: 'Definition updated' });
    })
  }

  generateServiceCode() {
    this.updateDefinitionJSON();
    this.wf.workflowDefinition = this.definitionJSON;
    this.workflowService.generateServiceCode(this.wf).then((res: any) => {
      this.msgService.add({ severity: 'success', summary: 'Generated', detail: 'Code generated' });
    })
  }


}
