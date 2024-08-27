import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { GenericService } from '../utils/genericservice';
import { Application } from './application';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService extends GenericService {
  endpoint: string = 'application';

  activeApplication: Application | undefined;

  private activeApplicationChange: BehaviorSubject<Application | undefined> =
    new BehaviorSubject<Application | undefined>(undefined); //GIve value immediately upon subscription, because it retains the last emitted value.

  constructor(http: HttpClient) {
    super(http);
    const savedApplication = localStorage.getItem('activeApplication');
    const initialValue = savedApplication
      ? JSON.parse(savedApplication)
      : undefined;
    this.activeApplicationChange = new BehaviorSubject<Application | undefined>(
      initialValue,
    );
    this.activeApplicationChange.subscribe((value) => {
      if (value) {
        localStorage.setItem('activeApplication', JSON.stringify(value));
      } else {
        localStorage.removeItem('activeApplication');
      }
    });
  }

  setActiveApplication(application: any) {
    this.activeApplicationChange.next(application);
  }

  getActiveApplication() {
    return this.activeApplicationChange.asObservable();
  }

  async generateFrontendCode(ms: any) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/generateWebFrontend/' +
      encodeURIComponent(ms.id!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }
}
