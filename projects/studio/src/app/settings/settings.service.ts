import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GenericService } from '../utils/genericservice';
import { Setting } from './setting';

@Injectable({
  providedIn: 'root',
})
export class SettingsService extends GenericService {
  endpoint: string = 'settings';

  constructor(
    http: HttpClient,
    private httpClient: HttpClient,
  ) {
    super(http);
  }

  async saveSettings(settings: Setting[]) {
    var url = this.apiurl + '/' + this.endpoint + '/saveSettings';
    const res = await lastValueFrom(this.httpClient.post<any>(url, settings));
    return res;
  }
}
