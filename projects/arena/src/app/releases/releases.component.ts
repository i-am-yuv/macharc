import { Component, OnInit } from '@angular/core';
import { MicroserviceService } from '../microservice/microservice.service';
import { MicroService } from '../microservice/microservice';
import { ReleasesService } from './releases.service';
import { Release } from './release';
import { Pipeline } from './pipeline';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.scss']
})
export class ReleasesComponent implements OnInit {


  msServices: MicroService[] = [];
  ms: MicroService = {};

  releases: Release[] = [];
  pipelines: Pipeline[] = [];
  jobs: any;
  jobsTotal: number = 0;
  failedPipeline: number = 0;
  suceessPipeline: number = 0;
  queuedPipeline: number = 0;
  loading = false;
  gitServerurl: string = environment.gitServerUrl;
  visible: boolean = false;

  constructor(
    private msService: MicroserviceService,
    private releasesService: ReleasesService) {

  }
  ngOnInit(): void {
    this.msService.getAllData().then(res => {
      this.msServices = res.content;
      if (res && res.content.length > 0) {
        this.ms = this.msServices[0];
        this.changeMs();
      }
    });

  }

  changeMs() {
    if (this.ms.repoId) {
      this.loading = true;
      this.releasesService.getRelease(this.ms.repoId!).then((res: any) => {
        this.releases = res;

        this.releasesService.getPipelines(this.ms.repoId!).then((res: any) => {
          this.pipelines = res;
          this.suceessPipeline = this.pipelines.filter(t => t.status === 'success').length;
          this.failedPipeline = this.pipelines.filter(t => t.status === 'failed').length;

          this.releasesService.getJobs(this.ms.repoId!).then((res: any) => {
            this.jobs = res;
            this.jobsTotal = res.length;
            this.queuedPipeline = this.jobs.filter((t: any) => t.status === 'pending').length;
            this.loading = false;
          });
        });
      });
    }
  }
}
