import { Component, OnInit } from '@angular/core';
import { SVG } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.draggable.js';
import { HostListener } from '@angular/core';
import { SwimLane } from './swim-lane';
import { StartEvent } from './start-event';
import { Task } from './task';
import { EndEvent } from './end-event';
import { Grid } from './grid';
import { Connector } from './connector';
import { Gateway } from './gateway';


@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent implements OnInit {

  draw: any;

  drawData: any[] = [];

  activeElement: any;

  selectedElements: any[] = [];
  connectors: any[] = [];

  screenHeight!: number;
  screenWidth!: number;

  tabactive: number = 1;


  constructor() { }

  ngOnInit(): void {

    this.getScreenSize();

    const dw = this.screenWidth - 250
    this.draw = SVG().addTo('#canvas').size(dw, '100vh');



    this.loadPallette();

    var grid = new Grid(this);
    grid.loadGrid();

    // this.loadDia();

  }
  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    setTimeout(() => {
      this.draw.attr({ width: this.screenWidth - 560 });
      const hw = this.draw.attr().width - 110;
      const holder = SVG("#grid");
      holder.attr({ width: hw });
    }, 100);

  }
  @HostListener('window:keydown.delete', ['$event'])
  @HostListener('window:keydown.backspace', ['$event'])
  onDeleteElement($event: KeyboardEvent) {
    if (this.activeElement) {
      const el = SVG('#' + this.activeElement.id);
      el.remove();
    }
  }

  setTabActive(t: any) {
    this.tabactive = t;
  }

  loadPallette() {
    var _app = this;
    const container = this.draw.rect(60, 700).fill('none').stroke({ color: '#888', width: 1 });
    container.move(20, 20);


    var startEvent = new StartEvent(this);
    startEvent.createStartEvent();

    var task = new Task(this);
    task.createTask();

    var endEvent = new EndEvent(this);
    endEvent.createEndEvent();


    var swimLane = new SwimLane(this);
    swimLane.createSwimLane();

    var gateway = new Gateway(this);
    gateway.createGateWay();

    var separator = this.draw.line('0,0 40,0').stroke({ color: '#ddd', width: 1 });
    separator.move(30, 280);

    var connector = new Connector(this);
    connector.createConnector();


    this.draw.on('click', (e: any) => {
      this.draw.off('mousemove');
    });

  }

  moveConnector(el: any) {
    var connector = new Connector(this);
    connector.moveConnector(el);
  }

  BringFront() {
    var elID = this.activeElement.id;
    var el = SVG('#' + elID);
    el.front();
    SVG('#grid').back();
  }

  SendBack() {
    var elID = this.activeElement.id;
    var el = SVG('#' + elID);
    el.back();
    SVG('#grid').back();
  }

  BringForward() {
    var elID = this.activeElement.id;
    var el = SVG('#' + elID);
    el.forward();
    SVG('#grid').back();
  }

  SendBackward() {
    var elID = this.activeElement.id;
    var el = SVG('#' + elID);
    el.backward();
    SVG('#grid').back();
  }

  makeActive(el: any) {
    var list = this.draw.find('.boundary');
    list.forEach((el: any) => {
      el.opacity(0);
    });
    el.opacity(1);
  }

  selectElement(el: any) {
    el.opacity(1);
  }

  unSelectAll() {
    this.activeElement = {};
    this.selectedElements = [];
    var list = this.draw.find('.boundary');
    list.forEach((el: any) => {
      el.opacity(0);
    });
  }
}
