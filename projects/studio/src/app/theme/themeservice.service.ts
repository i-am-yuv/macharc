import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService extends GenericService {

  endpoint: string = 'theme';

  constructor(http: HttpClient) {
    super(http);
  }
}
