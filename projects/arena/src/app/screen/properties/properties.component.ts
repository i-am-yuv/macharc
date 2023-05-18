import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html'
})
export class PropertiesComponent {
  @Input() props: any = {};
  @Input() fields: any = {};
  validations: any[] = ['Required', 'Alpha', 'Alpha Numeric', 'Numbers', 'Password', 'Email', 'Telephone', 'Pattern'];
}
