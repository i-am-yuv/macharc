import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { GenericService } from '../utils/genericservice';
import { Application } from '../application/application';
import { FilterBuilder } from '../utils/FilterBuilder';

@Injectable({
  providedIn: 'root',
})
export class MicroserviceService extends GenericService {
  endpoint: string = 'micro-services';

  activeApplication: Application | undefined;

  private activeApplicationChange: BehaviorSubject<Application | undefined> = new BehaviorSubject<Application | undefined>(undefined); //GIve value immediately upon subscription, because it retains the last emitted value.


  constructor(http: HttpClient) {
    super(http);
    this.activeApplicationChange.subscribe((value) => {
      this.activeApplication = value;
    });
  }

  // async generateCode(ms: any) {
  //   var url = this.apiurl + '/' + this.endpoint + '/generate/' + encodeURIComponent(ms.id!);
  //   const res = await lastValueFrom(this.http.get<any>(url));
  //   return res;
  // }

  async generateCode(ms: any) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/generate/' +
      encodeURIComponent(ms.id!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async generateFrontendCode(ms: any) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/generateFrontend/' +
      encodeURIComponent(ms.id!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }
  async linkDs(msId: string, dsId: string) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/addDataSource/' +
      encodeURIComponent(msId) +
      '/' +
      encodeURIComponent(dsId!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async unLinkDs(msId: string, dsId: string) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/removeDataSource/' +
      encodeURIComponent(msId) +
      '/' +
      encodeURIComponent(dsId!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async createMS(data: any) {
    var url = this.apiurl + '/' + this.endpoint + '/create';
    const res = await lastValueFrom(this.http.post<any>(url, data));
    return res;
  }

  setActiveApplication() {
    var search = FilterBuilder.boolEqual('isdefault', true);
    this.getAllData(undefined, search).then((res: any) => {
      this.activeApplicationChange.next(res.content[0]);
    });
  }

  getActiveProject() {
    return this.activeApplicationChange.asObservable();
  }
  
}
