import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FilterBuilder } from '../utils/FilterBuilder';
import { GenericService } from '../utils/genericservice';
import { Project } from './project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService extends GenericService {
  endpoint: string = 'projects';

  activeProject: Project | undefined;

  activeProjectChange: Subject<Project> = new Subject<Project>();

  constructor(http: HttpClient) {
    super(http);
    this.activeProjectChange.subscribe((value) => {
      this.activeProject = value;
    });
  }

  setActiveProject() {
    var search = FilterBuilder.boolEqual('isdefault', true);
    this.getAllData(undefined, search).then((res: any) => {
      this.activeProjectChange.next(res.content[0]);
    });
  }
  getActiveProject() {
  //  this.setActiveProject();
    return this.activeProjectChange.asObservable();
  }
}
