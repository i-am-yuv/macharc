import { Component } from '@angular/core';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent {
  editorOptions = { theme: 'vs-dark', language: 'sql', formatOnPaste: true, suggest: true };
  reportQuery: any;
}
