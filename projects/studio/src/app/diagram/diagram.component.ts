import { Component, OnInit } from '@angular/core';

import "snapsvg-cjs";
declare var Snap: any;

const move = function (this: any, dx: any, dy: any) {
  this.attr({
    transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
  });
}

const start = function (this: any) {
  this.data('origTransform', this.transform().local);
}
const stop = function () {
  console.log('finished dragging');
}

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements OnInit {
  ngOnInit(): void {
    this.createSvg();
  }

  cloneAndDrag(event: any, el: any, svgCanvas: any, initialX: number, initialY: number) {
    var clone = el.clone();
    clone.drag();
    var selectedElement = clone;

    // Add the cloned element to the paper
    svgCanvas.append(clone);

    // Record the initial mouse position
    const initialMouseX = event.clientX;
    const initialMouseY = event.clientY;

    // Record the initial position of the clone
    // const initialX = selectedElement.transform().dx;
    // const initialX = el.getBBox().x; 
    // const initialY = el.getBBox().y;
    console.log(initialMouseX, initialMouseY, initialX, initialY);

    // Mouse move event handler for dragging
    function moveHandler(event: any) {
      const dx = event.clientX - initialMouseX;
      const dy = event.clientY - initialMouseY;

      // Update the position of the selected element
      selectedElement.transform(`translate(${initialX + dx}, ${initialY + dy})`);
    }

    // Mouse up event handler
    function upHandler() {
      // Remove the move and up event listeners
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);

      // Clear the selected element
      selectedElement = null;
    }

    // Add move and up event listeners
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  }

  addToolBarItem(data: any, svgCanvas: any, xPos: number, yPos: number, width: number, fillColor?: string, fillOpacity: number = 0) {
    const lane = data.select('svg');
    var le = svgCanvas.group();
    le.append(data);
    var th = (width / lane.node.width.baseVal.value) * lane.node.height.baseVal.value;
    var r = le.rect(0, 10, width, th);
    r.attr({ fillOpacity: fillOpacity });
    le.transform(`t${xPos},${yPos}`)
    lane.attr({ width: width, fill: fillColor })

    le.mousedown((event: any) => {
      this.cloneAndDrag(event, le, svgCanvas, xPos, yPos);
    });
  }
  createWorkspace(svgCanvas: any) {
    var g = svgCanvas.group();
    // g.transform("t100,100");
    var workspace = g.rect(80, 0, 800, 650);
    workspace.attr({
      fill: "#fff",
      stroke: "#ccc"
    });
  }
  createToolbar(svgCanvas: any) {
    var g = svgCanvas.group();
    // g.transform("t100,100");
    var toolbar = g.rect(0, 0, 70, 650);
    toolbar.attr({
      fill: "#fff",
      stroke: "#ccc"
    });




    Snap.load('/assets/start-event.svg', (data: any) => {
      // const start = data.select('svg');
      // var se = svgCanvas.group();
      // se.append(data);
      // var th = (50 / start.node.width.baseVal.value) * start.node.height.baseVal.value;
      // var r = se.rect(0, 0, 50, th);
      // r.attr({ fillOpacity: 0.2 });
      // start.attr({ fill: "#00ff00" });
      // se.transform("t10,10")
      // se.mousedown((event: any) => {
      //   this.cloneAndDrag(event, se, svgCanvas, 10, 10);
      // });
      this.addToolBarItem(data, svgCanvas, 10, 10, 50, "#b9d23f");
    });



    Snap.load('/assets/lane.svg', (e: any) => {
      // const lane = e.select('svg');
      // var le = svgCanvas.group();
      // le.append(e);
      // var th = (50 / lane.node.width.baseVal.value) * lane.node.height.baseVal.value;
      // var r = le.rect(0, 10, 50, th);
      // r.attr({ fillOpacity: 0.2 });
      // le.transform("t10,60")
      // // le.transform("s10,10")
      // lane.attr({ width: 50 })

      // le.mousedown((event: any) => {
      //   this.cloneAndDrag(event, le, svgCanvas, 10, 60);
      // });
      this.addToolBarItem(e, svgCanvas, 10, 60, 50, "#43afeb");
    });


    Snap.load('/assets/usertask.svg', (e: any) => {
      // const lane = e.select('svg');
      // g.append(e);
      // lane.attr({ stroke: "#0000ff", x: 10, y: 110, width: 50 })
      this.addToolBarItem(e, svgCanvas, 10, 110, 50, "#43afeb");
      // const task = e.select('svg');
      // var le = svgCanvas.group();
      // le.append(e);
      // var th = (50 / task.node.width.baseVal.value) * task.node.height.baseVal.value;
      // var r = le.rect(0, 10, 50, th);
      // r.attr({ fillOpacity: 0.2 });
      // le.transform("t10,110")
      // task.attr({ width: 50 })

      // le.mousedown((event: any) => {
      //   this.cloneAndDrag(event, le, svgCanvas, 10, 110);
      // });
    });

    Snap.load('/assets/gateway-parallel.svg', (e: any) => {
      this.addToolBarItem(e, svgCanvas, 10, 160, 50, "#43afeb");
    });

    Snap.load('/assets/gateway-xor.svg', (e: any) => {
      this.addToolBarItem(e, svgCanvas, 10, 220, 50, "#43afeb");

    });

    Snap.load('/assets/service.svg', (e: any) => {
      this.addToolBarItem(e, svgCanvas, 10, 280, 50, "#43afeb");

    });

    Snap.load('/assets/data-store.svg', (e: any) => {
      this.addToolBarItem(e, svgCanvas, 10, 340, 50, "#43afeb");

    });

    Snap.load('/assets/start-event-message.svg', (e: any) => {
      this.addToolBarItem(e, svgCanvas, 10, 400, 50, "#43afeb");
    });

    Snap.load('/assets/end-event.svg', (e: any) => {
      // const lane = e.select('svg');
      // g.append(e);
      // lane.attr({ fill: "#0000ff", x: 10, y: 460 })
      this.addToolBarItem(e, svgCanvas, 10, 460, 50, "#f85347");

    });

  }


  //Create svg
  createSvg() {

    let svgCanvas;
    svgCanvas = Snap("#svg");

    // Lets create big circle in the middle:
    // var bigCircle = svgCanvas.circle(150, 150, 100);
    // // By default its black, lets change its attributes
    // bigCircle.attr({
    //   fill: "#bada55",
    //   stroke: "#000",
    //   strokeWidth: 5
    // });
    // // Now lets create another small circle:
    // var smallCircle = svgCanvas.circle(100, 150, 70);

    this.createToolbar(svgCanvas);
    this.createWorkspace(svgCanvas);
  }
}
