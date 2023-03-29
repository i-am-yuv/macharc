import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SwitchComponent)
    }
  ]
})
export class SwitchComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = "";

  @Input() className: string = "";

  @Input() disabled = false;

  onChange = (_: any) => { };

  onTouched = () => { };

  switchId = Math.floor(100000 + Math.random() * 900000);

  touched = false;

  checkBoxVal: any;

  constructor() { }

  sendData() {
    this.onChange(this.checkBoxVal);
  }

  writeValue(obj: any): void {
    this.checkBoxVal = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    this.className = twMerge('mt-2 mb-2', this.className);
  }
}

