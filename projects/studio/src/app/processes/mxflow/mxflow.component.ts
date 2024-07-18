import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Cell,
  CellHighlight,
  CellTracker,
  Codec,
  EdgeHandler,
  Geometry,
  Graph,
  InternalEvent,
  KeyHandler,
  MaxToolbar,
  RubberBandHandler,
  SelectionHandler,
  UndoManager,
  eventUtils,
  gestureUtils,
  xmlUtils,
  type CellStyle,
} from '@maxgraph/core';
import { MessageService } from '@splenta/vezo/src/public-api';
import { BusinessLogicService } from '../../business-logic/business-logic.service';
import { ScreenService } from '../../screen/screen.service';
import { Process } from '../process';
import { ProcessesService } from '../processes.service';

export interface ActiveElement {
  mxObjectId?: string;
  value?: string;
  style?: any;
  data?: any;
  type?: string;
  service?: string;
  endpoint?: string;
  screen?: string;
}

@Component({
  selector: 'app-mxflow',
  templateUrl: './mxflow.component.html',
  styleUrls: ['./mxflow.component.scss'],
})
export class MxflowComponent implements OnInit {
  @ViewChild('graphContainer', { read: ElementRef, static: true })
  container!: ElementRef;
  tabactive: number = 1;
  activeElement: ActiveElement = {};
  graph!: Graph;
  jsonData: any = {};
  xmlData: string = '';
  process: Process = {};

  fromXml: string | undefined = '';
  showXml: boolean = false;
  processId: string | null = '';

  editorOptions = { theme: 'vs-dark', language: 'xml', formatOnPaste: true };
  bpmnXml: string | null = '';
  undoManager: UndoManager = new UndoManager();
  screens: any;
  workflows: any;

  constructor(
    private processService: ProcessesService,
    private screenService: ScreenService,
    private workflowService: BusinessLogicService,
    private route: ActivatedRoute,
    private msgService: MessageService
  ) {}
  ngOnInit(): void {
    this.processId = this.route.snapshot.paramMap.get('id');

    // Graph definitions

    const tbContainer = document.createElement('div');
    tbContainer.className = 'toolbar';

    SelectionHandler.prototype.useGuidesForEvent = function (me) {
      return !eventUtils.isAltDown(me.getEvent());
    };

    SelectionHandler.prototype.guidesEnabled = true;

    this.graph = new Graph(this.container.nativeElement);
    this.graph.setGridEnabled(true);
    this.graph.setPanning(true);
    this.graph.gridSize = 10;

    const vertexStyle = this.graph.getStylesheet().getDefaultVertexStyle();
    const edgeStyle = this.graph.getStylesheet().getDefaultEdgeStyle();

    edgeStyle!.edgeStyle = 'orthogonalEdgeStyle';
    // edgeStyle!.rounded = true;

    edgeStyle!.labelBackgroundColor = '#ffffff';
    vertexStyle!.fillColor = 'white';
    vertexStyle!.swimlaneFillColor = 'rgba(0, 182, 255, 0.1)';

    new CellHighlight(this.graph, '#ff0000', 2);
    new CellTracker(this.graph, 'rgba(0, 182, 255, 0.4)');

    new RubberBandHandler(this.graph);

    // registerCustomShapes();

    EdgeHandler.prototype.snapToTerminals = true;

    this.container.nativeElement.appendChild(tbContainer);

    const toolbar = new MaxToolbar(tbContainer);
    toolbar.enabled = false;
    this.graph.setConnectable(true);
    this.graph.setCellsDeletable(true);
    this.graph.setAllowDanglingEdges(false);
    this.graph.setDisconnectOnMove(false);
    this.graph.gridSize = 1;

    var undoManager = this.undoManager;
    var listener = function (sender: any, evt: any) {
      undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    this.graph.getDataModel().addListener(InternalEvent.UNDO, listener);
    this.graph.getView().addListener(InternalEvent.UNDO, listener);
    this.graph.getDataModel().addListener(InternalEvent.REDO, listener);
    this.graph.getView().addListener(InternalEvent.REDO, listener);
    // this.graph.addListener(InternalEvent.UNDO, listener);
    // var redoListener = function (sender: any, evt: any) {
    //   console.log('redo', evt)
    //   undoManager.redo();
    // }
    // this.graph.getDataModel().addListener(InternalEvent.UNDO, undoListener);
    // this.graph.getView().addListener(InternalEvent.UNDO, undoListener);
    // this.graph.addListener(InternalEvent.UNDO, undoListener);
    // this.graph.addListener(InternalEvent.REDO, redoListener);
    // graph.dropEnabled = true;

    const addVertex = (
      type: string,
      label: string | null,
      icon: any,
      w: any,
      h: any,
      style: CellStyle
    ) => {
      // const vertex = new Cell(null, new Geometry(0, 0, w, h), style);
      if (!label) label = '';
      const vertex = new Cell(
        label,
        new Geometry(0, 0, w, h),
        <CellStyle>style
      );
      vertex.setVertex(true);

      this.addToolbarItem(type, this.graph, toolbar, vertex, icon);
    };

    addVertex('start-event', null, '/assets/start-event.svg', 50, 50, {
      shape: 'ellipse',
      fillColor: '#23d67d',
      aspect: 'fixed',
      fontColor: '#333333',
      labelPosition: 'left',
      align: 'center',
    });
    addVertex('swim-lane', 'Lane', '/assets/lane.svg', 600, 200, {
      shape: 'swimlane',
      horizontal: false,
    });
    addVertex('user-task', 'Task', '/assets/usertask.svg', 100, 40, {
      shape: 'rectangle',
      rounded: true,
    });
    // addVertex('connection', null, '/assets/connection.svg', 40, 40, { shape: 'ellipse' });
    // @ts-ignore
    addVertex(
      'gateway-parallel',
      null,
      '/assets/gateway-parallel.svg',
      50,
      50,
      {
        shape: 'image',
        image: '/assets/gateway-parallel.svg',
        verticalLabelPosition: 'bottom',
        verticalAlign: 'top',
      }
    );
    // @ts-ignore
    addVertex('gateway-xor', null, '/assets/gateway-xor.svg', 50, 50, {
      shape: 'image',
      image: '/assets/gateway-xor.svg',
      verticalLabelPosition: 'bottom',
      verticalAlign: 'top',
    });
    // @ts-ignore
    addVertex('service-task', null, '/assets/service.svg', 50, 50, {
      shape: 'image',
      image: '/assets/service.svg',
      verticalLabelPosition: 'bottom',
      verticalAlign: 'top',
    });
    // @ts-ignore
    addVertex('data-store', null, '/assets/data-store.svg', 50, 50, {
      shape: 'image',
      image: '/assets/data-store.svg',
      verticalLabelPosition: 'bottom',
      verticalAlign: 'top',
    });
    // @ts-ignore
    addVertex(
      'start-event-message',
      null,
      '/assets/start-event-message.svg',
      50,
      50,
      {
        shape: 'image',
        image: '/assets/start-event-message.svg',
        verticalLabelPosition: 'bottom',
        verticalAlign: 'top',
      }
    );
    // @ts-ignore
    addVertex('end-event', null, '/assets/end-event.svg', 50, 50, {
      shape: 'doubleEllipse',
      fillColor: '#db3e00',
      strokeColor: '#ffffff',
      labelPosition: 'left',
      align: 'center',
    });
    toolbar.addLine();

    this.graph.setPanning(true); // Use mouse right button for panning
    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    const parent = this.graph.getDefaultParent();

    this.processService.getData({ id: this.processId }).then((res: any) => {
      if (res) {
        this.process = res;
        this.getScreens();
        this.getWorkflows();
        if (this.process) {
          this.fromXml = this.process.processDefinition;
          this.renderXml();
        }
      }
    });

    // Adds cells to the model in a single step
    // graph.batchUpdate(() => {
    //   const vertex01 = graph.insertVertex(parent, null, 'Task', 100, 50, 100, 100, <CellStyle>{ fillColor: 'white' });
    //   const vertex02 = graph.insertVertex(parent, null, 'End', 350, 140, 50, 50, <CellStyle>{ shape: 'ellipse', fillColor: 'white' });
    //   graph.insertEdge(parent, null, null, vertex01, vertex02, <EdgeStyle>{ edgeStyle: 'orthogonalEdgeStyle', rounded: 0, orthogonalLoop: 1, jettySize: 'auto', html: 1 });

    // });
  }
  getScreens() {
    this.screenService
      .getScreensByMicroService(this.process.microService?.id)
      .then((res: any) => {
        this.screens = res;
      });
  }

  getWorkflows() {
    this.workflowService
      .getWorkflowsByMicroService(this.process.microService?.id)
      .then((res: any) => {
        this.workflows = res;
      });
  }

  addToolbarItem(
    type: string,
    graph: any,
    toolbar: MaxToolbar,
    prototype: any,
    image: any
  ) {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    const funct = (graph: any, evt: any, cell: any) => {
      graph.stopEditing(false);
      graph.getDataModel().beginUpdate();
      console.log(prototype);
      this.activeElement = prototype;

      const pt = graph.getPointForEvent(evt);
      const vertex = graph.getDataModel().cloneCell(prototype);
      vertex.geometry.x = pt.x;
      vertex.geometry.y = pt.y;
      vertex['type'] = type;
      vertex['service'] = '';
      vertex['screen'] = '';
      vertex['endpoint'] = '';

      graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
      graph.getDataModel().endUpdate();
    };

    // Creates the image which is used as the drag icon (preview)
    const img = toolbar.addMode(type, image, funct, image);
    gestureUtils.makeDraggable(img, graph, funct, img);

    this.graph.addListener(InternalEvent.CLICK, (sender: any, evt: any) => {
      if (evt.properties.cell) {
        this.activeElement = evt.properties.cell;
      }
    });
    graph.container.focus();
    var keyHandler = new KeyHandler(graph);
    keyHandler.bindControlKey(90, () => {
      this.undoManager.undo();
    });
    keyHandler.bindControlKey(89, () => {
      this.undoManager.redo();
    });
    keyHandler.bindKey(46, function (evt: any) {
      var cells = graph.getSelectionCells();
      graph.removeCells(cells);

      cells.forEach((cell: any) => {
        graph.view.clear(cell, true, false);
      });

      graph.refresh();
    });
    keyHandler.bindKey(8, function (evt: any) {
      var cells = graph.getSelectionCells();
      graph.removeCells(cells);

      cells.forEach((cell: any) => {
        graph.view.clear(cell, true, false);
      });

      graph.refresh();
    });
    var nudge = function (keyCode: number) {
      if (!graph.isSelectionEmpty()) {
        var dx = 0;
        var dy = 0;

        if (keyCode == 37) {
          dx = -1;
        } else if (keyCode == 38) {
          dy = -1;
        } else if (keyCode == 39) {
          dx = 1;
        } else if (keyCode == 40) {
          dy = 1;
        }

        graph.moveCells(graph.getSelectionCells(), dx, dy);
      }
    };
    keyHandler.bindKey(37, function () {
      nudge(37);
    });

    keyHandler.bindKey(38, function () {
      nudge(38);
    });

    keyHandler.bindKey(39, function () {
      nudge(39);
    });

    keyHandler.bindKey(40, function () {
      nudge(40);
    });
  }

  sendBack() {
    var cells = this.graph.getSelectionCells();
    this.graph.orderCells(true, cells);
    this.graph.refresh();
  }

  bringFront() {
    var cells = this.graph.getSelectionCells();
    this.graph.orderCells(false, cells);
    this.graph.refresh();
  }

  setTabActive(t: any) {
    this.tabactive = t;
  }

  setText() {
    if (this.activeElement) {
      var selectedCell = this.graph.getSelectionCell();
      selectedCell.setValue(this.activeElement.value);
      this.graph.refresh();
    }
  }

  setStyle() {
    if (this.activeElement) {
      var selectedCell = this.graph.getSelectionCell();
      selectedCell.setStyle(this.activeElement.style);
      this.graph.refresh();
    }
  }

  getBpmnXml() {
    this.getXmlModel();
    this.process.processDefinition = this.xmlData;
    this.processService.mxXmltoBpmn(this.process).then((res: any) => {
      this.bpmnXml = res.message;
      this.showXml = true;
    });
  }

  getXmlModel() {
    var encoder = new Codec();
    var node = encoder.encode(this.graph.getDataModel());
    if (node) {
      var xmlSerializer = new XMLSerializer();
      this.xmlData = this.prettifyXml(xmlSerializer.serializeToString(node));
    }
  }

  prettifyXml(sourceXml: string) {
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
    var xsltDoc = new DOMParser().parseFromString(
      [
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>',
      ].join('\n'),
      'application/xml'
    );

    var xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsltDoc);
    var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
    var resultXml = new XMLSerializer().serializeToString(resultDoc);
    return resultXml;
  }

  renderXml() {
    if (this.fromXml) {
      let doc = xmlUtils.parseXml(this.fromXml);
      this.parseXmlToGraph(doc, this.graph);
    }
  }

  undo() {
    this.undoManager.undo();
  }

  redo() {
    this.undoManager.redo();
  }

  stringifyWithoutCircular(json: any) {
    return JSON.stringify(
      json,
      (key, value) => {
        if (
          (key === 'parent' || key == 'source' || key == 'target') &&
          value !== null
        ) {
          return value.id;
        } else if (key === 'value' && value !== null && value.localName) {
          let results;
          Object.keys(value.attributes).forEach((attrKey) => {
            const attribute = value.attributes[attrKey];
            results[attribute.nodeName] = attribute.nodeValue;
          });
          return results;
        }
        return value;
      },
      4
    );
  }

  parseXmlToGraph(xmlDoc: any, graph: any) {
    const cells = xmlDoc.documentElement.children[0].children;
    const parent = graph.getDefaultParent();
    for (let i = 0; i < cells.length; i++) {
      const cellAttrs = cells[i].attributes;
      if (cellAttrs.vertex) {
        // is vertex

        const vertexName = cellAttrs.value.value;
        const vertexId = Number(cellAttrs.id.value);
        const geom = cells[i].children[0].attributes;
        const styles = cells[i].children[1].attributes;
        const attrs = Object.fromEntries(
          Array.from(styles)
            .map((item: any) => [item.name, item.value])
            .filter((t: any) => {
              return t[0] !== 'as';
            })
        );

        if (attrs.horizontal) {
          attrs.horizontal === '0'
            ? (attrs.horizontal = false)
            : (attrs.horizontal = true);
        }
        const xPos = Number(geom._x.nodeValue);
        const yPos = Number(geom._y.nodeValue);
        const height = Number(geom._height.nodeValue);
        const width = Number(geom._width.nodeValue);
        var c2 = graph.insertVertex(
          parent,
          vertexId,
          vertexName,
          xPos,
          yPos,
          width,
          height,
          <CellStyle>attrs
        );
        if (cellAttrs.type) {
          c2['type'] = cellAttrs.type.value;
        }
      }
    }
    for (let i = 0; i < cells.length; i++) {
      const cellAttrs = cells[i].attributes;
      if (cellAttrs.edge) {
        //is edge
        const edgeName = cellAttrs.value?.nodeValue;
        const edgeId = Number(cellAttrs.id.nodeValue);
        const source = Number(cellAttrs.source.nodeValue);
        const target = Number(cellAttrs.target.nodeValue);
        //console.log(edgeId, graph.getDataModel().getCell(source), target);
        //graph.insertEdge(parent, null, null, graph.getDataModel().getCell(source), graph.getDataModel().getCell(target), <EdgeStyle>{ edgeStyle: 'orthogonalEdgeStyle', rounded: 0, orthogonalLoop: 1, jettySize: 'auto', html: 1 });
        graph.insertEdge(
          parent,
          edgeId,
          edgeName,
          graph.getDataModel().getCell(source),
          graph.getDataModel().getCell(target)
        );
      }
    }
  }

  saveDefinition() {
    this.showXml = false;
    this.getXmlModel();
    this.process.processDefinition = this.xmlData;
    this.processService.updateData(this.process).then((res: any) => {
      this.msgService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Definition updated',
      });
    });
  }
}
