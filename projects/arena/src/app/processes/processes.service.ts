import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { Process } from './process';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends GenericService {

  endpoint: string = 'process';

  constructor(http: HttpClient, private httpClient: HttpClient) {
    super(http);
  }

  async mxXmltoBpmn(process: Process) {
    var url = this.apiurl + '/' + this.endpoint + '/mxXmltoBpmn';
    const res = await lastValueFrom(this.httpClient.post<any>(url, process));
    return res;
  }
}
