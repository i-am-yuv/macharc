import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReleasesService {

  apiurl: string = environment.apiurl;

  constructor(private httpClient: HttpClient) { }

  async getReleases() {
    var url = this.apiurl + '/source-code/releases';
    const res = await lastValueFrom(this.httpClient.get<any>(url));
    return res;
  }

  async getRelease(id: string) {
    var url = this.apiurl + '/source-code/releases/' + encodeURIComponent(id!);
    const res = await lastValueFrom(this.httpClient.get<any>(url));
    return res;
  }

  async getPipelines(id: string) {
    var url = this.apiurl + '/source-code/pipelines/' + encodeURIComponent(id!);
    const res = await lastValueFrom(this.httpClient.get<any>(url));
    return res;
  }

  async getJobs(id: string) {
    var url = this.apiurl + '/source-code/jobs/' + encodeURIComponent(id!);
    const res = await lastValueFrom(this.httpClient.get<any>(url));
    return res;
  }
}
