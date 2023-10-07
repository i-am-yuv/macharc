import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { AuthService } from './auth.service';




@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    refreshTokenInProgress = false;

    tokenRefreshedSource = new Subject();

    tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        request = this.addAuthHeader(request);

        // Handle response
        return next.handle(request).pipe(catchError(error => {
            return this.handleResponseError(error, request, next);
        }));
    }


    private tokenExpired(token: string) {
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        return (Math.floor((new Date).getTime() / 1000)) >= expiry;
    }

    addAuthHeader(request: HttpRequest<any>) {
        const accountToken = sessionStorage.getItem("token");
        if (accountToken) {
            return request.clone({
                setHeaders: { Authorization: `Bearer ${accountToken}` }
            });
        }
        return request;
    }

    refreshToken(): Observable<any> {
        if (this.refreshTokenInProgress) {
            return new Observable(observer => {
                this.tokenRefreshed$.subscribe(() => {
                    observer.next();
                    observer.complete();
                });
            });
        } else {
            this.refreshTokenInProgress = true;
            return this.authService.renewRefreshToken().pipe(map((data: any) => {
                sessionStorage.setItem('token', data.jwt);
                sessionStorage.setItem('refreshToken', data.refreshToken);
                this.refreshTokenInProgress = false;
                this.tokenRefreshedSource.next(true);
            }), catchError((err: any) => {
                this.refreshTokenInProgress = false;
                this.authService.redirectInvalid();
                return throwError(() => err);
            }));


        }
    }



    handleResponseError(error: any, request?: any, next?: any): any {
        // Business error
        if (error.status === 400) {
            // Show message
        }

        // Invalid token error
        else if (error.status === 401) {
            return this.refreshToken().pipe(
                switchMap(() => {
                    request = this.addAuthHeader(request);
                    return next.handle(request);
                }),
                catchError((e: any) => {
                    if (e.status !== 401) {
                        return this.handleResponseError(e);
                    } else {
                        this.authService.redirectInvalid();
                    }
                }));
        }

        // Access denied error
        else if (error.status === 403) {
            // Show message
            // Logout
            this.authService.redirectInvalid();
        }

        // Server error
        else if (error.status === 500) {
            // Show message
        }

        // Maintenance error
        else if (error.status === 503) {
            // Show message
            // Redirect to the maintenance page
        }

        return throwError(() => error);
    }



}