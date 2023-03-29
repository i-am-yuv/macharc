import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-inputnumber',
  templateUrl: './inputnumber.component.html',
  styleUrls: ['./inputnumber.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputnumberComponent
    }
  ]
})
export class InputnumberComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Input Number Label';

  @Input() className: string = '';

  @Input() type: string = 'text';

  @Input() placeholder: string = 'Enter Number';

  @Input() allowDecimals: boolean = false;

  @Input() allowSign: boolean = false;

  onChange(_: any) { };

  onTouched() { };

  touched = false;

  @Input() disabled: boolean = false;

  inputNumberVal: number | undefined;


  constructor() { }

  ngOnInit(): void {
    this.className = twMerge('border border-slate-300 p-1 pl-2 pr-2 mt-2 mb-2 w-full', this.className);
  }

  sendData() {
    this.onChange(this.inputNumberVal);
  }

  writeValue(obj: any): void {
    this.inputNumberVal = obj;
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

  increment(event: any) {
    if (!this.inputNumberVal) this.inputNumberVal = 0;
    this.inputNumberVal++;
    this.onChange(this.inputNumberVal);
  }

  decrement(event: any) {
    if (!this.inputNumberVal) this.inputNumberVal = 0;
    this.inputNumberVal--;
    this.onChange(this.inputNumberVal);
  }

}
