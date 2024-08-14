import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService extends GenericService {

  endpoint: string = 'themes';

  constructor(http: HttpClient) {
    super(http);
  }

  async updateThemeByApplicationId(applicationId: string, body: any) {
    var url = this.apiurl + '/' + this.endpoint + '/' + applicationId;
    const res = await lastValueFrom(this.http.post<any>(url, body));
    return res;
  }
  
  async getThemeByApplicationId(applicationId: string) {
    var url = this.apiurl + '/' + this.endpoint + '/' + applicationId;
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

}
