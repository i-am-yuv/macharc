import { Injectable } from "@angular/core";
import { GenericService } from "../utils/genericservice";
import { HttpClient } from "@angular/common/http";
import { Report } from "./report";
import { lastValueFrom } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class ReportService extends GenericService {


    endpoint: string = 'reports';

    constructor(http: HttpClient, private httpClient: HttpClient) {
        super(http);
    }

    async generateReport(reportData: Report) {
        var url = this.apiurl + '/' + this.endpoint + '/generateReportFrontendCode/' + encodeURIComponent(reportData.id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }

    async getReportsByMicroService(id: string | undefined) {
        var url = this.apiurl + '/' + this.endpoint + '/getReportsByMicroService/' + encodeURIComponent(id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }
}