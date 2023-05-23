import { Injectable } from "@angular/core";
import { GenericService } from "../utils/genericservice";
import { HttpClient } from "@angular/common/http";
import { Screen } from "./screen";
import { lastValueFrom } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class ScreenService extends GenericService {

    endpoint: string = 'screens';

    constructor(http: HttpClient, private httpClient: HttpClient) {
        super(http);
    }

    async generateComponent(screenData: Screen) {
        var url = this.apiurl + '/' + this.endpoint + '/generateFrontendCode/' + encodeURIComponent(screenData.id!);
        const res = await lastValueFrom(this.httpClient.get<any>(url));
        return res;
    }
}