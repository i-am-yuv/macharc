import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html'
})
export class PropertiesComponent {
  @Input() props: any = {};
  @Input() fields: any = {};
  @Output() deleteProp = new EventEmitter<boolean>();
  validations: any[] = ['Required', 'Alpha', 'Alpha Numeric', 'Numbers', 'Password', 'Email', 'Telephone', 'Pattern'];
  deleteProperty() {
    this.deleteProp.emit(true);
  }
}
