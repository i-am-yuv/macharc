import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { Workflow } from './workflow';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService extends GenericService {

  endpoint: string = 'workflow';

  constructor(http: HttpClient, private client: HttpClient) {
    super(http);
  }

  async generateServiceCode(wf: Workflow) {
    var url = this.apiurl + '/' + this.endpoint + '/generateServiceCode';
    const res = await lastValueFrom(this.client.post<any>(url, wf));
    return res;
  }
}
