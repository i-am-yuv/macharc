import { Injectable } from '@angular/core';
import { GenericService } from '../../utils/genericservice';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EndpointService extends GenericService {
  override endpoint: string = 'endpoints';

  constructor(http: HttpClient) {
    super(http);
  }
}
