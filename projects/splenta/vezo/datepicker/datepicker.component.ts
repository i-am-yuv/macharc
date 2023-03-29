import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'vezo-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatepickerComponent)
    }
  ]
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {

  @Input() label: string = 'Date Label';

  @Input() placeholder: string = 'Choose Date';

  @Input() className: string = '';

  @Input() disabled = false;

  @Input() datepickerValue: string | undefined;

  MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  showDatepicker = false;

  month!: number;
  year!: number;
  no_of_days: number[] = [];
  blankdays: any[] = [];

  onChange(_: any) { };

  onTouched() { };

  touched = false;

  constructor() { }

  ngOnInit(): void {
    this.initDate();
    this.getNoOfDays();
    this.className = twMerge('mt-2 mb-2 w-72', this.className);
  }

  initDate() {
    let today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString();
  }

  isToday(date: any) {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString() ? true : false;
  }

  getDateValue(date: any) {
    let selectedDate = new Date(this.year, this.month, date);
    this.onChange(selectedDate);
    this.datepickerValue = selectedDate.toDateString();
    this.showDatepicker = false;
  }

  getNoOfDays() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    // find where to start calendar day of week
    let dayOfWeek = new Date(this.year, this.month).getDay();
    let blankdaysArray = [];
    for (var i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    let daysArray = [];
    for (var i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    this.blankdays = blankdaysArray;
    this.no_of_days = daysArray;
  }

  trackByIdentity = (index: number, item: any) => item;

  writeValue(obj: any): void {
    if (obj) {
      this.datepickerValue = obj.toDateString();
    }
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
