import { Injectable } from "@angular/core";
import { GenericService } from "../utils/genericservice";
import { HttpClient } from "@angular/common/http";
@Injectable({
    providedIn: 'root'
})
export class ScreenService extends GenericService {
    endpoint: string = 'screens';

    constructor(http: HttpClient) {
        super(http);
    }
}