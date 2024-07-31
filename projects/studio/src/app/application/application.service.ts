import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { HttpClient } from '@angular/common/http';
import { Application } from './application';
import { BehaviorSubject } from 'rxjs';
import { FilterBuilder } from '../utils/FilterBuilder';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends GenericService {
  endpoint: string = 'application';

  activeApplication: Application | undefined;

  private activeApplicationChange: BehaviorSubject<Application | undefined> = new BehaviorSubject<Application | undefined>(undefined); //GIve value immediately upon subscription, because it retains the last emitted value.


  constructor(http: HttpClient) {
    super(http);
    const savedApplication = localStorage.getItem('activeApplication');
    const initialValue = savedApplication ? JSON.parse(savedApplication) : undefined;
    this.activeApplicationChange = new BehaviorSubject<Application | undefined>(initialValue);
    this.activeApplicationChange.subscribe((value) => {
      if (value) {
        localStorage.setItem('activeApplication', JSON.stringify(value));
      } else {
        localStorage.removeItem('activeApplication');
      }
    });
  }

  setActiveApplication(application : any) {
      this.activeApplicationChange.next(application) ;
  }

  getActiveApplication() {
    return this.activeApplicationChange.asObservable();
  }

}
