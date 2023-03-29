import { Component, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SelectComponent
    }
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = "";

  @Input() className: string = "";

  @Input() type: string = "text";

  @Input() placeholder: string = "";

  @Input() items: any[] = [];

  comboOpen: boolean = false;

  comboValue: any = { label: '', value: '' };

  onChange = (_comboValue: any) => { };

  onTouched = () => { };

  touched = false;

  disabled = false;

  constructor() { }

  ngOnInit(): void {
    this.className = twMerge('border border-slate-300 p-1 pl-2 pr-2 mt-2 mb-2 w-full', this.className);
  }

  toggleCombo(event: any) {
    this.comboOpen = !this.comboOpen;
    event.stopPropagation();
  }

  openCombo() {
    this.comboOpen = true;
  }

  closeCombo() {
    this.comboOpen = false;
  }
  selectComboItem(item: any) {
    this.markAsTouched();
    this.comboValue = { ...item };
    this.comboOpen = false;
    this.onChange(this.comboValue.value);
  }

  clearCombo(event: any) {
    this.comboValue = { label: '', value: '' };
    this.comboOpen = false;
    this.onChange(this.comboValue);
    event.stopPropagation();
  }

  writeValue(item: any) {
    if (!item) {
      item = { label: '', value: '' }
    }
    this.comboValue = item;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
