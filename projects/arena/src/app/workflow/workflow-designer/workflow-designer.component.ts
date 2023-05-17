import { Component, OnInit } from '@angular/core';
import { Definition, Designer, GlobalEditorContext, Properties, Step, StepEditorContext, StepsConfiguration, ToolboxConfiguration } from 'sequential-workflow-designer';
function createDefinition() {
  return {
    properties: {
      velocity: 0
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
  }

  public onDesignerReady(designer: Designer) {
    this.designer = designer;
    console.log('designer ready', this.designer);
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
      properties: properties || {}
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
        this.createTaskStep(null, 'task1', 'Task', null),
        this.createIfStep(null, [], []),
        this.createContainerStep(null, []),
        this.createTaskStep(null, 'text', 'Send email', null),
        this.createTaskStep(null, 'save', 'Save data', null),
      ]
    };
  }
}
