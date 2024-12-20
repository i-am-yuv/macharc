import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Engine } from '../flowy/Engine';

declare var flowy: any;
export interface Action {
  type: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) public canvas!: ElementRef;

  spacingx = 40;
  spacingy = 40;
  engine!: Engine;

  actions: Action[] = [
    {
      type: '1',
      icon: 'assets/eye.svg',
      title: 'User Task',
      description: 'Triggers when somebody visits a specified page',
    },
    {
      type: '2',
      icon: 'assets/action.svg',
      title: 'Call Endpoint',
      description: 'Call a backend service and store response in variable',
    },
    {
      type: '3',
      icon: 'assets/time.svg',
      title: 'Wait',
      description: 'Triggers after a specified amount of time',
    },
    {
      type: '4',
      icon: 'assets/error.svg',
      title: 'Error prompt',
      description: 'Triggers when a specified error happens',
    },
    {
      type: '5',
      icon: 'assets/error.svg',
      title: 'Condition',
      description: 'If else condition',
    },
    {
      type: '5',
      icon: 'assets/error.svg',
      title: 'Loop',
      description: 'Loop on data',
    },
    {
      type: '5',
      icon: 'assets/error.svg',
      title: 'Show dialog',
      description: 'Show dialog',
    },
  ];

  initialData = {
    html: '<div class="indicator invisible"></div><div _ngcontent-ng-c4277775131="" class="blockelem noselect block" style="left: 2975px; top: 2666px;"><input _ngcontent-ng-c4277775131="" type="hidden" name="blockelemtype" class="blockelemtype" value="2"><input type="hidden" name="blockid" class="blockid" value="0"><div class="blockyleft">\n    <img src="assets/action.svg">\n      <p class="blockyname">Call Endpoint</p>\n    </div>\n    <div class="blockyright">\n      <img src="assets/more.svg">\n    </div>\n    <div class="blockydiv"></div>\n    <div class="blockyinfo">When a <span>new visitor</span> goes to <span>Site 1</span></div></div>',
    blockarr: [
      {
        parent: -1,
        childWidth: 0,
        id: 0,
        x: 634,
        y: 227,
        width: 318,
        height: 122,
      },
    ],
    blocks: [
      {
        id: 0,
        parent: -1,
        data: [
          {
            name: 'blockelemtype',
            value: '2',
          },
          {
            name: 'blockid',
            value: '0',
          },
        ],
        attr: [
          {
            name: '_ngcontent-ng-c4277775131',
            value: '',
          },
          {
            name: 'class',
            value: 'blockelem noselect block',
          },
          {
            name: 'style',
            value: 'left: 2975px; top: 2666px;',
          },
        ],
      },
    ],
  };

  ngAfterViewInit(): void {
    this.engine = new Engine(
      this.canvas.nativeElement,
      this.spacingx,
      this.spacingy,
      this.onGrab,
      this.onRelease,
      this.onSnap.bind(this),
    );
    this.engine.import(this.initialData);
  }

  onGrab(block: any) {}
  onRelease() {}
  onSnap(drag: any) {
    const grab = drag.querySelector('.grabme');
    grab.parentNode.removeChild(grab);
    const blockin = drag.querySelector('.blockin');
    blockin.parentNode.removeChild(blockin);
    drag.innerHTML += this.getPlacedElement(
      drag.querySelector('.blockelemtype').value,
    );
    return true;
  }

  getPlacedElement(type: string) {
    const foundType = this.actions.find((action) => action.type === type);
    return `<div class="blockyleft">
    <img src="${foundType!.icon}">
      <p class="blockyname">${foundType!.title}</p>
    </div>
    <div class="blockyright">
      <img src="assets/more.svg">
    </div>
    <div class="blockydiv"></div>
    <div class="blockyinfo">When a <span>new visitor</span> goes to <span>Site 1</span></div>`;
  }

  getOutPut() {}
}
