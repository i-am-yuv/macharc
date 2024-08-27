import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GenericService } from '../../utils/genericservice';

@Injectable({
  providedIn: 'root',
})
export class EndpointService extends GenericService {
  override endpoint: string = 'endpoints';

  constructor(http: HttpClient) {
    super(http);
  }

  async getAllEndpointsByCollection(collectionId: any) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/getEndpoints/' +
      encodeURIComponent(collectionId);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }
}
