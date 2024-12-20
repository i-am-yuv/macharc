import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@splenta/vezo';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiurl: string = environment.apiurl;

  constructor(
    private router: Router,
    private msg: MessageService,
    private http: HttpClient,
  ) {}

  redirectToLogin() {
    localStorage.clear();
    this.msg.add({
      severity: 'error',
      summary: 'Session Expired',
      detail: 'Session Expired, login again',
    });
    this.router.navigate(['/login']);
  }
  redirectInvalid() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  getUserName(): string {
    const token = localStorage.getItem('token');
    let jwt: any = atob(token!.split('.')[1]);
    jwt = JSON.parse(jwt);
    return jwt.sub;
  }
  getAuthStatus() {
    const token = localStorage.getItem('token');
    let status = false;
    if (token) status = true;
    return status;
  }

  getRoles() {
    const token = localStorage.getItem('token');
    let jwt: any = atob(token!.split('.')[1]);
    jwt = JSON.parse(jwt);

    return jwt.roles;
  }

  renewRefreshToken() {
    var url = this.apiurl + '/auth/refreshtoken';
    localStorage.setItem('token', '');
    const refreshtoken = localStorage.getItem('refreshToken');
    var data = { refreshToken: refreshtoken };
    // const refreshdata = await lastValueFrom(this.http.post<any>(url, data));
    return this.http.post<any>(url, data);
  }

  getAuthToken() {
    const token = localStorage.getItem('token');
    return token;
  }
}
