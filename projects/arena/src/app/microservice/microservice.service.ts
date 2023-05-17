import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root'
})
export class MicroserviceService extends GenericService {
  endpoint: string = 'micro-services';

  constructor(http: HttpClient) {
    super(http);
  }

}
