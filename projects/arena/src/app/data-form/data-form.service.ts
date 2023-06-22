import { Injectable } from "@angular/core";
import { GenericService } from "../utils/genericservice";
import { HttpClient } from "@angular/common/http";
import { DataForm } from "./data-form";
import { lastValueFrom } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class DataFormService extends GenericService {
    async getDataFormsByMicroService(id: string | undefined) {
        var url = this.apiurl + '/' + this.endpoint + '/getDataFormsByMicroService/' + encodeURIComponent(id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }

    endpoint: string = 'data-forms';

    constructor(http: HttpClient, private httpClient: HttpClient) {
        super(http);
    }

    async generateComponent(screenData: DataForm) {
        var url = this.apiurl + '/' + this.endpoint + '/generateFrontendCode/' + encodeURIComponent(screenData.id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }
}