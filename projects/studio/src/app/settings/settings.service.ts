import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends GenericService {
  endpoint: string = 'settings';

  constructor(http: HttpClient) {
    super(http);
  }
}
