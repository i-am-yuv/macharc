import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileuploadComponent
    }
  ]
})
export class FileuploadComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = "Choose file";

  @Input() className: string = "";

  @Input() disabled = false;

  @Input() files: any[] = [];

  onChange = (_: any) => { };

  onTouched = () => { };

  touched = false;

  fileVal: any;

  constructor() {

  }

  ngOnInit(): void {
    this.className = twMerge('py-2 px-4 bg-blue-600 text-white mr-2', this.className);
  }

  sendData(event: any) {
    this.files = event.target.files;
    this.onChange(this.files);
  }

  writeValue(obj: any): void {
    this.files = obj;
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
