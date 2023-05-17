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

  comboValue: any = {};

  isObj: boolean = false;

  displayValue: string = '';

  @Input() optionLabel: string = '';

  @Input() optionValue: string = '';

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
    this.comboOpen = false;
    if (this.isObj) {
      this.comboValue = { ...item };
      this.displayValue = this.comboValue[this.optionLabel];
      if (this.optionValue) {
        this.comboValue = this.comboValue[this.optionValue];
      }
    } else {
      this.displayValue = item;
      this.comboValue = item;
    }
    this.onChange(this.comboValue);
  }

  clearCombo(event: any) {
    this.comboValue = { label: '', value: '' };
    this.comboOpen = false;
    this.onChange(this.comboValue);
    event.stopPropagation();
  }

  writeValue(item: any) {
    this.isObj = false;
    if (Array.isArray(this.items) && this.items.length > 0 && typeof this.items[0] === 'object' && !this.optionLabel) {
      console.log("If select items are objects label field is required");
    } else {
      this.isObj = true;
    }
    if (!item) {
      return;
    } else if (typeof item === 'object' && item !== null && !this.optionLabel) {
      console.log("If select items are objects label field is required");
      return;
    } else if (typeof item === 'object' && item !== null && this.optionLabel) {
      this.comboValue = this.items.find((t: any) => {
        return t[this.optionLabel] === item[this.optionLabel]
      });
      this.displayValue = this.comboValue[this.optionLabel];
      this.isObj = true;
    } else if (typeof item !== 'object' && item !== null) {
      console.log(item);
      this.comboValue = item;
      this.displayValue = item;
    } else {
      console.log('Not handled select option');
    }
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
