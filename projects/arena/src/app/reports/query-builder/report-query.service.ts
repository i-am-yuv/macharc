import { Injectable } from '@angular/core';
import { GenericService } from '../../utils/genericservice';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportQueryService extends GenericService {
  override endpoint: string = 'report-queries';

  constructor(http: HttpClient, private httpClient: HttpClient) {
    super(http);
  }
}
