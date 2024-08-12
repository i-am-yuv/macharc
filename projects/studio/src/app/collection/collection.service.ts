import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService extends GenericService {



  endpoint: string = 'collection';

  constructor(http: HttpClient) {
    super(http);
  }

  async generateFromTable(collectionId: string) {
    var url = this.apiurl + '/' + this.endpoint + '/generateFromTable/' + encodeURIComponent(collectionId);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async generateDTO(collectionId: string, payload: any) {
    var url = this.apiurl + '/generate-dto/collection/'+encodeURIComponent(collectionId)+ '/generate';
    const res = await lastValueFrom(this.http.post<any>(url , payload));
    return res;
  }

  async generateCode(collectionId: string) {
    var url = this.apiurl + '/' + this.endpoint + '/generateCode/' + encodeURIComponent(collectionId);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }
}


