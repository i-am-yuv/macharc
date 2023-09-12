import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from '@splenta/vezo';

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

  constructor(
    private messageService: MessageService
  ) {

  }

  @Output() deleteProp = new EventEmitter<boolean>();
  validations: any[] = ['Required', 'Alpha', 'Alpha Numeric', 'Numbers', 'Password', 'Email', 'Telephone', 'Pattern'];
  formData: any;

  deleteProperty() {
    this.deleteProp.emit(true);
  }
  deleteColumn() {
    var indexToDelete = this.props.data.cols.findIndex((t: any) => t.field === this.column.field);
    if (indexToDelete > 0) {
      this.props.data.cols.splice(indexToDelete, 1);
      this.column = {};
    }
  }
  addColumn() {
    var indexToUpdate = this.props.data.cols.findIndex((t: any) => t.field === this.column.field);
    console.log(this.column);

    if (!this.column.heading) {
      this.messageService.add({ severity: 'error', detail: 'Add a heading', summary: 'Error' });
      return;
    }

    if (indexToUpdate > 0) {

      this.props.data.cols[indexToUpdate] = this.column;
    } else {
      this.props.data.cols.push(this.column);
    }
    this.column = {};
  }

  newColumn() {
    this.column = {};
  }

  setColumn(col: any) {
    this.column = col;
  }

  setForm() {
    this.props.children = JSON.parse(this.formData.formDefinition);
    console.log(this.props);
  }
}
