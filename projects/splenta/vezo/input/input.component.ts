import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent
    }
  ]
})
export class InputComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Input Label';

  @Input() className: string = '';

  @Input() type: string = 'text';

  @Input() placeholder: string = 'Enter text';

  onChange(_: any) { };

  onTouched() { };

  touched = false;

  @Input() disabled: boolean = false;

  inputVal: any;

  constructor() { }

  ngOnInit(): void {
    this.className = twMerge('border border-slate-300 p-1 pl-2 pr-2 mt-2 mb-2 w-full', this.className);
  }

  sendData() {
    this.onChange(this.inputVal);
  }

  writeValue(obj: any): void {
    this.inputVal = obj;
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

}
