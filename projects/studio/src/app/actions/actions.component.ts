import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
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
import { BusinessLogic } from '../business-logic/business-logic';
import { BusinessLogicService } from '../business-logic/business-logic.service';
import { DataFormService } from '../data-form/data-form.service';
import { LayoutService } from '../layout/layout.service';
import { GenericComponent } from '../utils/genericcomponent';
import { Actions } from './action';
import { ActionService } from './action.service';

declare var flowy: any;
function createDefinition() {
  return {
    properties: {
      collections: '',
      velocity: 0,
      declarations: '',
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

  data: Actions[] = [];
  componentName: string = 'Action Form';
  form!: FormGroup<any>;

  private designer?: Designer;

  public definition: Definition = createDefinition();
  public definitionJSON?: string;

  wfId: string | null = '';
  wf: BusinessLogic = {};
  dataDef: string | undefined = '';

  allActions: Actions[] = [];
  actionId: any;
  currentAction: Actions = {};

  constructor(
    private businessLogicService: BusinessLogicService,
    private route: ActivatedRoute,
    private actionService: ActionService,
    private formService: DataFormService,
    private msgService: MessageService,
    private layoutService: LayoutService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super(actionService, msgService);
    this.form = this.fb.group({
      id: '',
      actionName: ['', Validators.required],
      actionType: ['', Validators.required],
      actionTasks: [''],
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
    this.actionId = this.route.snapshot.paramMap.get('id');
    this.layoutService.checkPadding(false);
    this.getAllData();
    if (this.actionId) {
      this.getThisAction(this.actionId);
    }

    this.updateDefinitionJSON();
    this.wfId = this.route.snapshot.paramMap.get('id');
    if (this.wfId) {
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
    } else {
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
    this.actionId = action.id;
    this.router.navigate(['/actions/' + action.id]);
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
      properties: properties || { velocity: 0, expression: '' },
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
        this.createTaskStep(null, 'task', 'Task', null),
        this.createIfStep(null, [], []),
        this.createContainerStep(null, []),
        this.createTaskStep(null, 'text', 'Send email', null),
        this.createTaskStep(null, 'save', 'Save data', null),
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
}
