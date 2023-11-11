import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends GenericService {
  endpoint: string = 'application';

  constructor(http: HttpClient) {
    super(http);
  }

}
