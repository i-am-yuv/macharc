import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';

@Injectable({
  providedIn: 'root'
})
export class CollectionService extends GenericService {

  endpoint: string = 'collection';

  constructor(http: HttpClient) {
    super(http);
  }
}


