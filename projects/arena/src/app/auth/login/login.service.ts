import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiurl: string = environment.apiurl;

  constructor(private http: HttpClient) { }

  doLogin(credentials: any) {
    var url = this.apiurl + '/auth/authenticate'
    return this.http.post<any>(url, credentials)
      .toPromise()
      .then(data => { return data; });
  }
}
