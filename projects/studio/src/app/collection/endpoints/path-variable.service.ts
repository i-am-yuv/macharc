import { Injectable } from '@angular/core';
import { GenericService } from '../../utils/genericservice';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PathVariableService extends GenericService {

  override endpoint: string = 'pathVariable';

  constructor(http: HttpClient) {
    super(http);
  }
}
