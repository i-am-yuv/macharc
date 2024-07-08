import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { iif } from 'rxjs';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html'
})
export class PropertiesComponent {

  @Input() props: any = {};
  @Input() fields: any[] = [];
  @Input() collections: any[] = [];
  @Input() forms: any[] = [];
  @Input() comingFromForm: boolean = false;

  @Output() getCollectionFields: EventEmitter<string> = new EventEmitter<string>();;

  column: any = {};

  boxShawdowOptions: any = ['sm', 'md', 'lg', 'xl', '2xl', 'inner', 'none'];

  constructor(
    private messageService: MessageService,
    private router: Router
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
    this.props.data.cols.push(this.column);
  }

  setColumn(col: any) {
    this.column = col;
  }

  setForm() {
    this.props.children = JSON.parse(this.formData.formDefinition);
    this.props.data.formId = this.formData.id;
    this.props.data.formName = this.formData.formName;
    console.log(this.props.data);
  }
  getFields() {
    this.getCollectionFields.emit(this.props.data.collection.id);
  }

  findComponent(componentId: any) {
    this.router.navigate(['/builder/forms/designer/' + componentId]);
  }

  makeItMapped(item: any, element: any) {
    if (!item) {
      item = {}; // Initialize item if it's undefined
    }
    if (item.mappedData && item.mappedData[element] === '[isMapped]') {
      delete item.mappedData[element]; // Remove the key if it has the value '[isMapped]'
    } else {
      if (!item.mappedData) {
        item.mappedData = {}; // Initialize mappedData if it's undefined
      }
      item.mappedData[element] = '[isMapped]'; // Set the value
    }
    console.log(item);
  }

  // Function to handle changes to the ngModel
  handleInputChange(value: string, element: any): void {
    if (this.comingFromForm) {
      this.props.mappedData[element] = value;
    } else {
      this.props.data[element] = value;
    }
  }

  getInputValue(element: any): string {
    if( this.comingFromForm ==  true )
      {
        return this.props.mappedData[element] ;
      }
    else{
          if(this.props.mappedData != null && this.props.mappedData[element] != null )
            { 
              return this.props.mappedData[element] ;
            }
            else{
              return this.props.data[element] ;
            }
    }
  }
}
