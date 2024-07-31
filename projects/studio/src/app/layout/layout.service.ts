import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  showSideBar = false;

  givePadding !: Observable<true>;

  //sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();
   sidebarVisibilityChange: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined); //GIve value immediately upon subscription, because it retains the last emitted value.

  checkForPadding = new Subject<any>();

  constructor() {
    this.sidebarVisibilityChange.subscribe((value : any) => {
      this.showSideBar = value;
    });
    this.givePadding = this.checkForPadding.asObservable();
  }

  toggleSidebarVisibility() {
    this.sidebarVisibilityChange.next(!this.showSideBar);
  }

  checkPadding(data :any )
  {
       this.checkForPadding.next(data);
  }
}
