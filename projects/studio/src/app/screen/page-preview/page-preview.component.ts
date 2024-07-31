import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-preview',
  templateUrl: './page-preview.component.html',
  styleUrls: ['./page-preview.component.scss']
})
export class PagePreviewComponent implements OnInit{

  @Input() draggableListRight : any ;

  ngOnInit(){
  }


}
