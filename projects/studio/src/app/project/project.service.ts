import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericService } from '../utils/genericservice';
import { Project } from './project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends GenericService {
  endpoint: string = 'projects';

  activeProject: Project | undefined;

  //activeProjectChange: Subject<Project> = new Subject<Project>(); //This will not give the value because the subscription happens after the emission.
  private activeProjectChange: BehaviorSubject<Project | undefined> =
    new BehaviorSubject<Project | undefined>(undefined); //GIve value immediately upon subscription, because it retains the last emitted value.

  constructor(http: HttpClient) {
    super(http);
    this.activeProjectChange.subscribe((value) => {
      this.activeProject = value;
      if (!value) {
        if (localStorage.getItem('activeProject')) {
          this.activeProject = JSON.parse(
            localStorage.getItem('activeProject') || '{}',
          ) as Project;
          this.activeProjectChange.next(this.activeProject);
        }
      }
    });
  }

  setActiveProject() {
    var search = FilterBuilder.boolEqual('isdefault', true);
    this.getAllData(undefined, search).then((res: any) => {
      localStorage.setItem('activeProject', JSON.stringify(res.content[0]));
      this.activeProjectChange.next(res.content[0]);
    });
  }
  getActiveProject() {
    return this.activeProjectChange.asObservable();
  }
}
