import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MicroserviceService extends GenericService {


  endpoint: string = 'micro-services';

  constructor(http: HttpClient, private httpClient: HttpClient) {
    super(http);
  }

  async generateCode(ms: any) {
    var url = this.apiurl + '/' + this.endpoint + '/generate/' + encodeURIComponent(ms.id!);
    const res = await lastValueFrom(this.httpClient.get<any>(url));
    return res;
  }
  async generateFrontendCode(ms: any) {
    var url = this.apiurl + '/' + this.endpoint + '/generateFrontend/' + encodeURIComponent(ms.id!);
    const res = await lastValueFrom(this.httpClient.get<any>(url));
    return res;
  }
}
