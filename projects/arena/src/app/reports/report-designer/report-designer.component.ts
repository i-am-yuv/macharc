import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { DropEffect, DndDropEvent, EffectAllowed } from 'ngx-drag-drop';
import { Collection } from '../../collection/collection';
import { CollectionService } from '../../collection/collection.service';
import { Field } from '../../fields/field';
import { FieldService } from '../../fields/field.service';
import { FilterBuilder } from '../../utils/FilterBuilder';
import { Report } from '../report';
import { ReportService } from '../report.service';
import { DataFormService } from '../../data-form/data-form.service';
import { DataForm } from '../../data-form/data-form';

interface DropzoneLayout {
  container: string;
  list: string;
  dndHorizontal: boolean;
}
interface DraggableItem {
  name: string;
  content: string;
  effectAllowed: EffectAllowed;
  disable: boolean;
  handle: boolean;
  data?: any;
  children?: any[];
}
@Component({
  selector: 'app-report-designer',
  templateUrl: './report-designer.component.html',
  styleUrls: ['./report-designer.component.scss'],
})
export class ReportDesignerComponent {
  draggableListLeft: DraggableItem[] = [
    {
      name: 'toolbar',
      content: 'Toolbar',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'ToolBar' },
    },

    {
      name: 'input',
      content: 'Input',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      // data: { label: 'Input Label' },
      data: { label: 'Input Label' },
    },

    {
      name: 'heading',
      content: 'Heading',
      data: { text: 'Heading' },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
    },

    {
      name: 'dropdown',
      content: 'Dropdown',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Dropdown' },
    },
    {
      name: 'textarea',
      content: 'Textarea',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Textarea' },
    },
    {
      name: 'button',
      content: 'Button',
      effectAllowed: 'copy',
      disable: false,
      handle: true,
      data: { label: 'Input Label' },
    },
    {
      name: 'checkbox',
      content: 'Checkbox',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Checkbox' },
    },
    {
      name: 'radio',
      content: 'Radio',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Radio' },
    },
    {
      name: 'switch',
      content: 'Switch',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Switch' },
    },
    {
      name: 'date',
      content: 'Date',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: { label: 'Input Date' },
    },
    {
      name: 'section',
      content: 'Section 2 columns',
      data: { columns: 2 },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
    },
    {
      name: 'section',
      content: 'Section 3 columns',
      data: { columns: 3 },
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
    },
    {
      name: 'card',
      content: 'Card',
      data: {},
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
    },
    {
      name: 'accordion',
      content: 'Accordion',
      data: {},
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
    },
    {
      name: 'form',
      content: 'Data Form',
      data: {},
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      children: [],
    },
    {
      name: 'table',
      content: 'Table',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        actions: [
          {
            label: 'Edit',
            icon: 'pencil',
          },
          {
            label: 'Delete',
            icon: 'trash',
          },
        ],
        caption: 'Table Heading',
        columns: [
          {
            heading: 'Code',
            field: 'code',
            sortable: true,
            filterable: true,
          },
          {
            heading: 'Name',
            field: 'name',
            sortable: true,
            filterable: true,
          },
        ],
        rows: [
          {
            code: 1,
            name: 'Name 1',
          },
          {
            code: 2,
            name: 'Name 2',
          },
          {
            code: 3,
            name: 'Name 3',
          },
        ],
      },
    },
    {
      name: 'table-readonly',
      content: 'Table-ReadOnly',
      effectAllowed: 'copy',
      disable: false,
      handle: false,
      data: {
        caption: 'Table Heading',
        columns: [
          {
            heading: 'Code',
            field: 'code',
            sortable: true,
            filterable: true,
          },
          {
            heading: 'Name',
            field: 'name',
            sortable: true,
            filterable: true,
          },
        ],
        rows: [
          {
            code: 1,
            name: 'Name 1',
          },
          {
            code: 2,
            name: 'Name 2',
          },
          {
            code: 3,
            name: 'Name 3',
          },
        ],
      },
    },
  ];

  draggableListRight: DraggableItem[] = [];

  reportData: Report = {};

  private readonly verticalLayout: DropzoneLayout = {
    container: 'row',
    list: 'column',
    dndHorizontal: false,
  };
  layout: DropzoneLayout = this.verticalLayout;
  showProps: boolean = false;
  activeItem: any;
  reportId: string | null = '';
  fields: Field[] = [];
  collections: Collection[] = [];
  forms: DataForm[] = [];

  constructor(
    private reportService: ReportService,
    private fieldService: FieldService,
    private formsService: DataFormService,
    private collectionService: CollectionService,
    private route: ActivatedRoute,
    private msgService: MessageService
  ) {}
  public ngOnInit() {
    this.reportId = this.route.snapshot.paramMap.get('id');
    this.reportService.getData({ id: this.reportId }).then((res: any) => {
      this.reportData = res;
      if (res.reportDefinition)
        this.draggableListRight = JSON.parse(res.reportDefinition);
      if (this.reportData) {
        var filterStr = FilterBuilder.equal(
          'microService.id',
          this.reportData?.microService?.id!
        );
        this.reportService.getAllData(undefined, filterStr).then((res: any) => {
          this.fields = res.content;
        });
        this.collectionService.getAllData().then((res: any) => {
          this.collections = res.content;
        });
      }
      this.formsService.getAllData().then((res: any) => {
        this.forms = res.content;
      });
    });
  }
  onDragged(item: any, list: any[], effect: DropEffect) {
    // this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;

    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }
  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }
      event.data['id'] = Math.floor(Math.random() * 1000000);
      list.splice(index, 0, event.data);

      this.activeItem = event.data;
    }
  }

  saveDefinition() {
    this.reportData.reportDefinition = JSON.stringify(this.draggableListRight);
    this.reportService.updateData(this.reportData).then((res: any) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Definition updated',
      });
    });
  }

  generateReport() {
    this.reportService.generateReport(this.reportData).then((res: any) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Generated',
        detail: 'Code Generated',
      });
    });
  }

  deleteActiveItem(val: boolean) {
    this.draggableListRight.splice(
      this.draggableListRight.findIndex(
        (a: any) => a.id === this.activeItem.id
      ),
      1
    );
  }

  handleClick(event: MouseEvent, item: any) {
    event.stopPropagation();
    this.activeItem = item;
  }
}
