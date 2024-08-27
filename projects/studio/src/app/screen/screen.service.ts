import { Injectable } from "@angular/core";
import { GenericService } from "../utils/genericservice";
import { HttpClient } from "@angular/common/http";
import { Screen } from "./screen";
import { lastValueFrom } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class ScreenService extends GenericService {
    async getScreensByMicroService(id: string | undefined) {
        var url = this.apiurl + '/' + this.endpoint + '/getScreensByMicroService/' + encodeURIComponent(id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }

    endpoint: string = 'screens';

    constructor(http: HttpClient, private httpClient: HttpClient) {
        super(http);
    }

    async generateComponent(screenData: Screen) {
        var url = this.apiurl + '/' + this.endpoint + '/generateFrontendCode/' + encodeURIComponent(screenData.id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }

    async createPageData(screenData: Screen) {
        var url = this.apiurl + '/' + this.endpoint + '/pageParams';
        const res = await lastValueFrom(this.httpClient.post<any>(url,screenData));
        return res;
    }

    async updatePageData(screenData: Screen) {
        var url = this.apiurl + '/' + this.endpoint + '/pageParams';
        const res = await lastValueFrom(this.httpClient.put<any>(url,screenData));
        return res;
    }

    async createPageParams(payload: any) {
        var url = this.apiurl + '/pageParam';
        const res = await lastValueFrom(this.httpClient.post<any>(url,payload));
        return res;
    }

    
}