import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  apiUrl = environment.apiurl;

  constructor(private httpClient: HttpClient) {
  }    
 
  async createFolder(payload : any) {
    var url = this.apiUrl + '/folder';
    const res = await lastValueFrom(this.httpClient.post<any>(url , payload));
    return res;
  }

  async updateFolder(payload : any) {
    var url = this.apiUrl + '/folder' ;
    const res = await lastValueFrom(this.httpClient.put<any>(url , payload));
    return res;
  }

  async deleteFolder(payload : any) {
    var url = this.apiUrl + '/folder/'+ encodeURIComponent(payload.id!); ;
    const res = await lastValueFrom(this.httpClient.delete<any>(url));
    return res;
  }

  async getAllFolders() {
    var url = this.apiUrl + '/folder?pageNo=0&pageSize=100&sortDir=DESC&size=100';
    const allFolders = await lastValueFrom(this.httpClient.get<any>(url));
    return allFolders;
  }

  // Assets Service  ----------------------------------------------------------------------------->

  async uploadAssets(payload :any) {
    var url = this.apiUrl + '/asset' ;
    const result = await lastValueFrom(this.httpClient.post<any>(url, payload));
    return result;
  }

  async editAssets(payload :any) {
    var url = this.apiUrl + '/asset' ;
    const result = await lastValueFrom(this.httpClient.put<any>(url, payload));
    return result;
  }

  async deleteAsset(payload :any) {
    var url = this.apiUrl + '/asset'+ encodeURIComponent(payload.id!);
    const result = await lastValueFrom(this.httpClient.delete<any>(url, payload));
    return result;
  }

  async getAssetsByFolderId(folder:any) {
    var url = this.apiUrl + '/asset/folder/'+ encodeURIComponent(folder.id!); ;
    const result = await lastValueFrom(this.httpClient.get<any>(url));
    return result;
  }

  async getAssetsByAssetId(payload:any) {
    var url = this.apiUrl + '/asset/'+ encodeURIComponent(payload!); ;
    const result = await lastValueFrom(this.httpClient.get<any>(url));
    return result;
  }
}
