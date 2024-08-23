import { Injectable } from '@angular/core';
import { GenericService } from '../../utils/genericservice';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndpointService extends GenericService {
  override endpoint: string = 'endpoints';

  constructor(http: HttpClient) {
    super(http);
  }

  async getAllEndpointsByCollection(collectionId: any) {
    var url = this.apiurl+'/'+this.endpoint+ '/getEndpoints/'+encodeURIComponent(collectionId);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }
}
