import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MicroserviceService extends GenericService {

  endpoint: string = 'micro-services';

  constructor(http: HttpClient) {
    super(http);
  }

  // async generateCode(ms: any) {
  //   var url = this.apiurl + '/' + this.endpoint + '/generate/' + encodeURIComponent(ms.id!);
  //   const res = await lastValueFrom(this.http.get<any>(url));
  //   return res;
  // }

  async generateCode(ms: any) {
    var url = this.apiurl + '/' + this.endpoint + '/generate/' + encodeURIComponent(ms.id!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }


  async generateFrontendCode(ms: any) {
    var url = this.apiurl + '/' + this.endpoint + '/generateFrontend/' + encodeURIComponent(ms.id!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }
  async linkDs(msId: string, dsId: string) {
    var url = this.apiurl + '/' + this.endpoint + '/addDataSource/' + encodeURIComponent(msId) + '/' + encodeURIComponent(dsId!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async unLinkDs(msId: string, dsId: string) {
    var url = this.apiurl + '/' + this.endpoint + '/removeDataSource/' + encodeURIComponent(msId) + '/' + encodeURIComponent(dsId!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async createMS(data: any) {
    var url = this.apiurl + '/' +this.endpoint+'/create';
    const res = await lastValueFrom(this.http.post<any>(url, data));
    return res;
  }
}
