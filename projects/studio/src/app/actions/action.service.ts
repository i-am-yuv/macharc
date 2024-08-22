import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Actions } from './action';

@Injectable({
  providedIn: 'root'
})
export class ActionService extends GenericService {
  
  apiUrl = environment.apiurl;

  endpoint: string = 'actions';

  constructor(http: HttpClient, private httpClient: HttpClient) {
    super(http);
  }    
 
  async getActionByActionId(actionId:any) {
    var url = this.apiUrl + '/actions/'+ encodeURIComponent(actionId!); ;
    const result = await lastValueFrom(this.httpClient.get<any>(url));
    return result;
  }
  

  async getAllActionsByMsId(msId:any) {
    var url = this.apiUrl + '/actions/getActionsByMicroService/'+ encodeURIComponent(msId!); ;
    const result = await lastValueFrom(this.httpClient.get<any>(url));
    return result;
  }

  async generateServiceCode(action: Actions) {
    var url = this.apiurl + '/' + this.endpoint + '/generateServiceCode';
    const res = await lastValueFrom(this.http.post<any>(url, action));
    return res;
  }

  // async createFolder(payload : any) {
  //   var url = this.apiUrl + '/folder';
  //   const res = await lastValueFrom(this.httpClient.post<any>(url , payload));
  //   return res;
  // }

  // async updateFolder(payload : any) {
  //   var url = this.apiUrl + '/folder' ;
  //   const res = await lastValueFrom(this.httpClient.put<any>(url , payload));
  //   return res;
  // }

  // async deleteFolder(payload : any) {
  //   var url = this.apiUrl + '/folder/'+ encodeURIComponent(payload.id!); ;
  //   const res = await lastValueFrom(this.httpClient.delete<any>(url));
  //   return res;
  // }

  // async getAllFolders() {
  //   var url = this.apiUrl + '/folder?pageNo=0&pageSize=100&sortDir=DESC&size=100';
  //   const allFolders = await lastValueFrom(this.httpClient.get<any>(url));
  //   return allFolders;
  // }

  // // Assets Service  ----------------------------------------------------------------------------->

  // async uploadAssets(payload :any) {
  //   var url = this.apiUrl + '/asset' ;
  //   const result = await lastValueFrom(this.httpClient.post<any>(url, payload));
  //   return result;
  // }

  // async editAssets(payload :any) {
  //   var url = this.apiUrl + '/asset' ;
  //   const result = await lastValueFrom(this.httpClient.put<any>(url, payload));
  //   return result;
  // }

  // async deleteAsset(payload :any) {
  //   var url = this.apiUrl + '/asset/'+ encodeURIComponent(payload.id!);
  //   const result = await lastValueFrom(this.httpClient.delete<any>(url, payload));
  //   return result;
  // }

  // async getAssetsByFolderId(folderId:any) {
  //   var url = this.apiUrl + '/asset/folder/'+ encodeURIComponent(folderId!); ;
  //   const result = await lastValueFrom(this.httpClient.get<any>(url));
  //   return result;
  // }

  // async getAssetsByAssetId(payload:any) {
  //   var url = this.apiUrl + '/asset/'+ encodeURIComponent(payload!); ;
  //   const result = await lastValueFrom(this.httpClient.get<any>(url));
  //   return result;
  // }
}
