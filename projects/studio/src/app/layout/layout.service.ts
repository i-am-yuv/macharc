import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  showSideBar = false;

  sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.sidebarVisibilityChange.subscribe((value : any) => {
      this.showSideBar = value;
    });
  }

  toggleSidebarVisibility() {
    this.sidebarVisibilityChange.next(!this.showSideBar);
  }
}
