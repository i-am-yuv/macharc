import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nested-preview',
  templateUrl: './nested-preview.component.html',
  styleUrls: ['./nested-preview.component.scss']
})
export class NestedPreviewComponent {

  @Input() child: any;
  @Input() nestedElement!: string;


}
