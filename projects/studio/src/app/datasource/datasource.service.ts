import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Datasource } from './datasource';
import { GenericService } from '../utils/genericservice';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DatasourceService extends GenericService {

  endpoint: string = 'datasource';

  constructor(http: HttpClient) {
    super(http);
  }

  async regenerateDatasource(microserviceId: string | null) {
    var url = this.apiurl + '/' + this.endpoint + '/regenerateDataSources/' + microserviceId;
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async createDatasource(form: FormGroup<any>) {
    var url = this.apiurl + '/' + this.endpoint + "/createDatasource";
    const res = await lastValueFrom(this.http.post<any>(url, form));
    return res;
  }

}
