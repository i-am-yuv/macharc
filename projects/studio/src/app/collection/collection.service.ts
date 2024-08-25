import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root',
})
export class CollectionService extends GenericService {
  endpoint: string = 'collection';

  constructor(http: HttpClient) {
    super(http);
  }

  async generateFromTable(collectionId: string) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/generateFromTable/' +
      encodeURIComponent(collectionId);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async generateRequestDTO(collectionId: string, payload: any) {
    var url =
      this.apiurl +
      '/generate-dtoRequest/collection/' +
      encodeURIComponent(collectionId) +
      '/generateRequest';
    const res = await lastValueFrom(this.http.post<any>(url, payload));
    return res;
  }

  async generateResponseDTO(collectionId: string, payload: any) {
    var url =
      this.apiurl +
      '/generate-dtoResponse/collection/' +
      encodeURIComponent(collectionId) +
      '/generateResponse';
    const res = await lastValueFrom(this.http.post<any>(url, payload));
    return res;
  }

  async generateCode(collectionId: string) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/generateCode/' +
      encodeURIComponent(collectionId);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async getRequestDto(collectionId: any) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/getRequestDto/' +
      encodeURIComponent(collectionId);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async getResponseDto(collectionId: any) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/getResponseDto/' +
      encodeURIComponent(collectionId);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }
}
