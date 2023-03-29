import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService extends GenericService {
  endpoint: string = 'workflow';

  constructor(http: HttpClient) {
    super(http);
  }
}