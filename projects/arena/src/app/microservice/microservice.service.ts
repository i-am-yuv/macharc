import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from '../utils/genericservice';
import { MicroService } from './microservice';

@Injectable({
  providedIn: 'root'
})
export class MicroserviceService extends GenericService {
  endpoint: string = 'micro-services';

  constructor(http: HttpClient) {
    super(http);
  }

}
