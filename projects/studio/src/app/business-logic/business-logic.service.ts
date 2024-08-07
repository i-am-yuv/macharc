import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericService } from '../utils/genericservice';
import { BusinessLogic } from './business-logic';

@Injectable({
  providedIn: 'root',
})
export class BusinessLogicService extends GenericService {
  endpoint: string = 'workflow';

  llmUrl: string = environment.llmUrl;

  constructor(http: HttpClient) {
    super(http);
  }

  async generateServiceCode(wf: BusinessLogic) {
    var url = this.apiurl + '/' + this.endpoint + '/generateServiceCode';
    const res = await lastValueFrom(this.http.post<any>(url, wf));
    return res;
  }

  async saveGeneratedCode(wf: BusinessLogic) {
    var url = this.apiurl + '/' + this.endpoint + '/saveServiceCode';
    const res = await lastValueFrom(this.http.post<any>(url, wf));
    return res;
  }

  async getWorkflowsByMicroService(id: string | undefined) {
    var url =
      this.apiurl +
      '/' +
      this.endpoint +
      '/getWorkflowsByMicroService/' +
      encodeURIComponent(id!);
    const res = await lastValueFrom(this.http.get<any>(url));
    return res;
  }

  async getLLMGeneratedCode(
    prompt: string,
    serviceName: string,
    microserviceName: string
  ) {
    var url = this.llmUrl + '/api/generate';
    var payload = {
      model: 'codeqwen',
      // prompt:
      //   'You are an expert programmer that writes simple, concise code. Only respond with code as plain text, without code blocks. Create a service class in sping 3.1.0 using the following business logic. \n\n' +
      //   prompt +
      //   '\n\n}',
      prompt:
        'The following is a complete Java file named ' +
        serviceName +
        ' in the project ' +
        microserviceName +
        '. Anything NOT code is written as a CODE COMMENT.  Only respond with code as plain text, without code blocks. Create a service class in sping 3.1.0 for ' +
        prompt,
    };
    // const res = await lastValueFrom(this.http.post<any>(url, payload));
    // const res = await lastValueFrom(
    //   this.http.post<any>(url, payload, {
    //     reportProgress: true,
    //     observe: 'events',
    //   })
    // );

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const obj = await res;

    return obj;
  }

  // async getCollectionFieldsByCollectionId(collectionId: any) {
  //   var url = this.apiurl + '/field?filter=collection.id%20%3A%20%27ce8f1faf-138e-4786-a9ab-6ef52a862e63%27'
  //   const res = await lastValueFrom(this.http.post<any>(url, wf));
  //   return res;
  // }
}
