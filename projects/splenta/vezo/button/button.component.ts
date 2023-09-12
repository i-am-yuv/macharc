import { Component, Input, OnInit } from '@angular/core';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() label: string = "";

  @Input() icon: string = "";

  @Input() className: string = "";

  @Input() disabled: boolean = false;
  @Input() labelPosition: string = 'left';

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.className = twMerge('py-2 px-4 bg-indigo-100 hover:bg-white border border-indigo-200 text-indigo-700 font-semibold rounded', this.className);
  }

}
