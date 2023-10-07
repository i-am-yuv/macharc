import { Injectable } from "@angular/core";
import { GenericService } from "../utils/genericservice";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class MarketplaceService extends GenericService {
    endpoint: string = 'marketplace';

    constructor(http: HttpClient) {
        super(http);
    }

}