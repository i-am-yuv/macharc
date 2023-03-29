import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Datasource } from '../datasource/datasource';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root'
})
export class DatasourceService extends GenericService {
  endpoint: string = 'datasource';

  constructor(http: HttpClient) {
    super(http);
  }

}
