import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root'
})
export class ProcessesService extends GenericService {
  endpoint: string = 'process';

  constructor(http: HttpClient) {
    super(http);
  }
}
