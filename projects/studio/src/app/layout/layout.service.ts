import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  showSideBar = false;

  //sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();
   sidebarVisibilityChange: BehaviorSubject<boolean | undefined> = new BehaviorSubject<boolean | undefined>(undefined); //GIve value immediately upon subscription, because it retains the last emitted value.

  constructor() {
    this.sidebarVisibilityChange.subscribe((value : any) => {
      this.showSideBar = value;
    });
  }

  toggleSidebarVisibility() {
    this.sidebarVisibilityChange.next(!this.showSideBar);
  }
}
