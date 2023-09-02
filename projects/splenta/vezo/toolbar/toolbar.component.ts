import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ToolbarComponent,
    },
  ],
})
export class ToolbarComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = 'Textarea Label';

  @Input() className: string = '';

  @Input() placeholder: string = 'Enter text';

  @Input() rows: string = '3';

  textAreaVal: string = '';

  onChange(_: any) {}

  onTouched() {}

  touched = false;

  disabled = false;

  constructor() {}

  sendData() {
    this.onChange(this.textAreaVal);
  }

  writeValue(obj: any): void {
    this.textAreaVal = obj;
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
    this.className = twMerge(
      'border border-slate-300 rounded p-2 mt-2 mb-2 w-full',
      this.className
    );
  }
}
