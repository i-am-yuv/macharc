import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MicroserviceService } from '../microservice.service';
import { MicroService } from '../microservice';
declare let Redoc: any

@Component({
  selector: 'app-apidoc',
  templateUrl: './apidoc.component.html'
})
export class ApidocComponent implements OnInit {
  msId: string | null = '';
  ms: MicroService = {};
  constructor(private route: ActivatedRoute, private msService: MicroserviceService) {

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
    Redoc.init('http://localhost:' + this.ms.portNumber + '/v3/api-docs', {
      scrollYOffset: 60,
      hideDownloadButton: true
    }, document.getElementById('redoc'))
  }
}
