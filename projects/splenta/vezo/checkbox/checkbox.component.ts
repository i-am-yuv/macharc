import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CheckboxComponent
    }
  ]
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = "";

  @Input() className: string = "";

  onChange = (_: any) => { };

  onTouched = () => { };

  touched = false;

  disabled = false;

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
    this.className = twMerge('border border-slate-300 p-1 mt-2 mb-3 mr-2 w-5 h-5 align-middle', this.className);
  }



}
