import { Component, Input, OnInit } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent implements OnInit {

  @Input() header: string = "";

  @Input() rightIcon: string = "";

  @Input() leftIcon: string = "";

  @Input() selected: boolean = false;

  @Input() className: string = "";

  ngOnInit(): void {
    this.className = twMerge('p-3', this.className);

  }
}
