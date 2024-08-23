import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root',
})
export class MicroserviceService extends GenericService {
  endpoint: string = 'micro-services';

  activeMicroservice: MicroserviceService | undefined;

  private activeMicroserviceChange: BehaviorSubject<MicroserviceService | undefined> = new BehaviorSubject<MicroserviceService | undefined>(undefined); //GIve value immediately upon subscription, because it retains the last emitted value.


  constructor(http: HttpClient) {
    super(http);
    const savedMicroservice = localStorage.getItem('activeMicroservice');
    const initialValue = savedMicroservice ? JSON.parse(savedMicroservice) : undefined;
    this.activeMicroserviceChange = new BehaviorSubject<MicroserviceService | undefined>(initialValue);
    this.activeMicroserviceChange.subscribe((value) => {
      if (value) {
        localStorage.setItem('activeMicroservice', JSON.stringify(value));
      } else {
        localStorage.removeItem('activeMicroservice');
      }
    });
  }

  setActiveMicroservice(application: any) {
    this.activeMicroserviceChange.next(application);
  }

  getActiveMicroservice() {
    return this.activeMicroserviceChange.asObservable();
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

  async commitCode(msId: string | null) {
    var url = this.apiurl + '/' + this.endpoint + '/commitCode/' + msId;
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  goToActions( ms : any )
  {
    
  }
}
