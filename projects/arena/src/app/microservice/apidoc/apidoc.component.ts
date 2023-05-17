import { Component, OnInit } from '@angular/core';
declare let Redoc: any

@Component({
  selector: 'app-apidoc',
  templateUrl: './apidoc.component.html'
})
export class ApidocComponent implements OnInit {
  ngOnInit(): void {
    this.initDocs();
  }

  initDocs() {
    Redoc.init('http://localhost:8222/v3/api-docs', {
      scrollYOffset: 60,
      hideDownloadButton: true
    }, document.getElementById('redoc'))
  }
}
