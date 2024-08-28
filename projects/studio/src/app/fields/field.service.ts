import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericService } from '../utils/genericservice';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService extends GenericService {
  endpoint: string = 'field';

  constructor(http: HttpClient) {
    super(http);
  }

  async getFieldsByRequestDto(reqDtoId: any) {
    var url = this.apiurl + '/field/requestDto/'+encodeURIComponent(reqDtoId)+ '/fields';
    const res = await lastValueFrom(this.http.get<any>(url ));
    return res;
  }
}
