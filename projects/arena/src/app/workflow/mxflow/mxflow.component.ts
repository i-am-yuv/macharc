import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { type CellStyle, Graph, MaxToolbar, gestureUtils, Cell, Geometry, KeyHandler, SelectionHandler, InternalEvent } from '@maxgraph/core';

@Component({
  selector: 'app-mxflow',
  templateUrl: './mxflow.component.html',
  styleUrls: ['./mxflow.component.scss']
})
export class MxflowComponent implements OnInit {



  @ViewChild('graphContainer', { read: ElementRef, static: true })
  container!: ElementRef;
  tabactive: number = 1;
  activeElement: any = { value: '', style: {} };
  graph!: Graph;

  ngOnInit(): void {

    const tbContainer = document.createElement('div');
    tbContainer.className = 'toolbar';
    this.graph = new Graph(this.container.nativeElement);

    const vertexStyle = this.graph.getStylesheet().getDefaultVertexStyle();
    const edgeStyle = this.graph.getStylesheet().getDefaultEdgeStyle();
    edgeStyle!.edgeStyle = 'orthogonalEdgeStyle';
    edgeStyle!.backgroundColor = '#ffffff';
    vertexStyle!.fillColor = 'white';

    this.container.nativeElement.appendChild(tbContainer);

    const toolbar = new MaxToolbar(tbContainer);
    toolbar.enabled = false;
    this.graph.setConnectable(true);
    this.graph.setCellsDeletable(true);
    this.graph.setAllowDanglingEdges(false);


    // graph.dropEnabled = true;

    const addVertex = (type: string, label: string | null, icon: any, w: any, h: any, style: CellStyle) => {
      // const vertex = new Cell(null, new Geometry(0, 0, w, h), style);
      if (!label) label = '';
      const vertex = new Cell(label, new Geometry(0, 0, w, h), <CellStyle>style);
      vertex.setVertex(true);

      this.addToolbarItem(type, this.graph, toolbar, vertex, icon);
    };

    addVertex('start-event', null, '/assets/start-event.svg', 50, 50, { shape: 'ellipse', fillColor: '#23d67d', aspect: 'fixed', fontColor: '#ffffff' });
    addVertex('swimlane', 'Lane', '/assets/lane.svg', 600, 200, { shape: 'swimlane', horizontal: false });
    addVertex('task', 'Task', '/assets/task.svg', 100, 40, { shape: 'rectangle', rounded: true });
    // addVertex('connection', null, '/assets/connection.svg', 40, 40, { shape: 'ellipse' });
    addVertex('gateway-parallel', null, '/assets/gateway-parallel.svg', 60, 60, { shape: 'rhombus' });
    addVertex('gateway-xor', null, '/assets/gateway-xor.svg', 60, 60, { shape: 'triangle' });
    addVertex('service', null, '/assets/service.svg', 100, 40, { shape: 'rectangle', rounded: true });
    addVertex('data-store', null, '/assets/data-store.svg', 60, 80, { shape: 'cylinder' });
    addVertex('start-event-message', null, '/assets/start-event-message.svg', 30, 40, { shape: 'actor' });
    addVertex('end-event', null, '/assets/end-event.svg', 60, 60, { shape: 'doubleEllipse', fillColor: '#db3e00', strokeColor: '#ffffff' });
    toolbar.addLine();

    this.graph.setPanning(true); // Use mouse right button for panning
    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    const parent = this.graph.getDefaultParent();



    // Adds cells to the model in a single step
    // graph.batchUpdate(() => {
    //   const vertex01 = graph.insertVertex(parent, null, 'Task', 100, 50, 100, 100, <CellStyle>{ fillColor: 'white' });
    //   const vertex02 = graph.insertVertex(parent, null, 'End', 350, 140, 50, 50, <CellStyle>{ shape: 'ellipse', fillColor: 'white' });
    //   graph.insertEdge(parent, null, null, vertex01, vertex02, <EdgeStyle>{ edgeStyle: 'orthogonalEdgeStyle', rounded: 0, orthogonalLoop: 1, jettySize: 'auto', html: 1 });

    // });
  }

  addToolbarItem(type: string, graph: any, toolbar: MaxToolbar, prototype: any, image: any) {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    const funct = (graph: any, evt: any, cell: any) => {
      graph.stopEditing(false);

      console.log(prototype);
      this.activeElement = prototype;

      const pt = graph.getPointForEvent(evt);
      const vertex = graph.getDataModel().cloneCell(prototype);
      vertex.geometry.x = pt.x;
      vertex.geometry.y = pt.y;

      graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
    };

    // Creates the image which is used as the drag icon (preview)
    const img = toolbar.addMode(type, image, funct, image);
    gestureUtils.makeDraggable(img, graph, funct, img);


    this.graph.addListener(InternalEvent.CLICK, (sender: any, evt: any) => {
      if (evt.properties.cell) {
        this.activeElement = evt.properties.cell;
      }
    });

    var keyHandler = new KeyHandler(graph);
    keyHandler.bindKey(46, function (evt: any) {
      var cells = graph.getSelectionCells();
      graph.removeCells(cells);

      cells.forEach((cell: any) => {
        graph.view.clear(cell, true, false);
      })


      graph.refresh();
    });
    keyHandler.bindKey(8, function (evt: any) {
      var cells = graph.getSelectionCells();
      graph.removeCells(cells);

      cells.forEach((cell: any) => {
        graph.view.clear(cell, true, false);
      })


      graph.refresh();
    });
  }

  sendBack() {
    var cells = this.graph.getSelectionCells();
    this.graph.orderCells(true, cells);
  }

  bringFront() {
    var cells = this.graph.getSelectionCells();
    this.graph.orderCells(false, cells);
  }
  // @HostListener('document:keyup', ['$event'])
  delete(event: KeyboardEvent) {

    if (event.key === 'Delete' || event.key === 'Backspace') {

      var cells = this.graph.getSelectionCells();
      this.graph.removeCells(cells);

      cells.forEach(cell => {
        this.graph.view.clear(cell, true, false);
      })


      this.graph.refresh();
    }

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

}
