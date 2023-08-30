import { Injectable } from "@angular/core";
import { GenericService } from "../utils/genericservice";
import { HttpClient } from "@angular/common/http";
import { Report } from "./report";
import { lastValueFrom } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class ReportService extends GenericService {
    async getReportsByMicroService(id: string | undefined) {
        var url = this.apiurl + '/' + this.endpoint + '/getReportsByMicroService/' + encodeURIComponent(id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }

    endpoint: string = 'data-forms';

    constructor(http: HttpClient, private httpClient: HttpClient) {
        super(http);
    }

    async generateComponent(screenData: Report) {
        var url = this.apiurl + '/' + this.endpoint + '/generateFrontendCode/' + encodeURIComponent(screenData.id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }
}