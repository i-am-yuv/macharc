import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MicroserviceService } from '../microservice.service';
import { MicroService } from '../microservice';
import { environment } from 'projects/studio/src/environments/environment';
declare let Redoc: any

@Component({
  selector: 'app-apidoc',
  templateUrl: './apidoc.component.html'
})
export class ApidocComponent implements OnInit {
  msId: string | null = '';
  ms: MicroService = {};
  apiDescriptionUrl = '';
  basePath: string = '';

  @ViewChild('el') div: ElementRef | undefined;

  constructor(
    private elRef: ElementRef,
    private route: ActivatedRoute,
    private msService: MicroserviceService, private router: Router) {

  }
  ngOnInit(): void {

    this.msId = this.route.snapshot.paramMap.get('id');

    if (this.msId) {
      this.msService.getData({ id: this.msId }).then((res) => {
        this.ms = res
        this.initDocs();
      });
    }





  }


  initDocs() {
    this.apiDescriptionUrl = 'http://localhost:' + this.ms.portNumber + '/v3/api-docs';
    this.basePath = this.router.url;
    // Redoc.init('http://localhost:' + this.ms.portNumber + '/v3/api-docs', {
    //   scrollYOffset: 60,
    //   hideDownloadButton: true
    // }, document.getElementById('redoc'))
  }
}
