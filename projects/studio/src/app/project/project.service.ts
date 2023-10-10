import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends GenericService {
  endpoint: string = 'projects';

  constructor(http: HttpClient) {
    super(http);
  }

}
