import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root'
})
export class FieldService extends GenericService {
  endpoint: string = 'field';

  constructor(http: HttpClient) {
    super(http);
  }
}
