import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo/src/public-api';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiurl: string = environment.apiurl;

  constructor(private router: Router, private msg: MessageService, private http: HttpClient) { }

  redirectToLogin() {
    sessionStorage.clear();
    this.msg.add({ severity: 'error', summary: 'Session Expired', detail: 'Session Expired, login again' });
    this.router.navigate(['/login']);
  }
  redirectInvalid() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  getUserName(): string {
    const token = sessionStorage.getItem("token");
    let jwt: any = atob(token!.split('.')[1]);
    jwt = JSON.parse(jwt);
    return jwt.sub;
  }
  getAuthStatus() {
    const token = sessionStorage.getItem("token");
    let status = false;
    if (token) status = true;
    return status;
  }

  getAuthToken() {
    const token = sessionStorage.getItem("token");
    return token;
  }

  getRoles() {
    const token = sessionStorage.getItem("token");
    let jwt: any = atob(token!.split('.')[1]);
    jwt = JSON.parse(jwt);
    // console.log(jwt.roles);
    return jwt.roles;
  }

  renewRefreshToken() {
    var url = this.apiurl + '/auth/refreshtoken';
    sessionStorage.setItem('token', '');
    const refreshtoken = sessionStorage.getItem('refreshToken');
    var data = { refreshToken: refreshtoken };
    // const refreshdata = await lastValueFrom(this.http.post<any>(url, data));
    return this.http.post<any>(url, data);
  }

}
