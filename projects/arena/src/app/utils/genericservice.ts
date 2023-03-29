import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { environment } from "../../environments/environment";

export abstract class GenericService {

    apiurl: string = environment.apiurl;

    abstract endpoint: string;

    constructor(private http: HttpClient) { }

    // async getAllData() {
    //     var url = this.apiurl + '/' + this.endpoint;
    //     const res: any = await lastValueFrom(this.http.get<any>(url));
    //     return res;
    // }
    async getAllData(pageNo?: number, pageSize?: number, sortField?: string, sortDir?: string, search?: string) {
        var params = [];
        if (pageNo) {
            params.push('page=' + pageNo);
        }
        if (pageSize) {
            params.push('size=' + pageSize);
        }
        if (sortField) {
            params.push('sort=' + sortField + ',' + sortDir);
        }
        if (search) {
            params.push('filter=' + search);
        }
        var pageFilter = '';
        if (params.length > 0) {
            pageFilter += '?' + params.join('&');
        }
        var url = this.apiurl + '/' + this.endpoint + pageFilter;
        const res = await lastValueFrom(this.http.get<any>(url));
        return res;
    }

    async getData(data: any) {
        var url = this.apiurl + '/' + this.endpoint + '/' + encodeURIComponent(data.id!);
        const res = await lastValueFrom(this.http.get<any>(url));
        return res;
    }
    async createData(data: any) {
        var url = this.apiurl + '/' + this.endpoint;
        const res = await lastValueFrom(this.http.post<any>(url, data));
        return res;
    }

    async updateData(data: any) {
        var url = this.apiurl + '/' + this.endpoint;
        const res = await lastValueFrom(this.http.put<any>(url, data));
        return res;
    }
    async deleteData(data: any) {
        var url = this.apiurl + '/' + this.endpoint + '/' + encodeURIComponent(data.id!);
        const res = await lastValueFrom(this.http.delete<any>(url));
        return res;
    }

}