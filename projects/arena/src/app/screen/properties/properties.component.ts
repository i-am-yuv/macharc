import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html'
})
export class PropertiesComponent {

  @Input() props: any = {};
  @Input() fields: any[] = [];
  @Input() collections: any[] = [];
  @Input() forms: any[] = [];

  column: any = {};

  @Output() deleteProp = new EventEmitter<boolean>();
  validations: any[] = ['Required', 'Alpha', 'Alpha Numeric', 'Numbers', 'Password', 'Email', 'Telephone', 'Pattern'];
  formData: any;

  deleteProperty() {
    this.deleteProp.emit(true);
  }

  addColumn() {
    this.props.data.columns.push(this.column);
  }

  setColumn(col: any) {
    this.column = col;
  }

  setForm() {
    this.props.children = JSON.parse(this.formData.formDefinition);
    console.log(this.props);
  }
}
