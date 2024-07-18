import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GcpUploadService {

  private readonly BUCKET_NAME = 'your-bucket-name';
  private readonly UPLOAD_URL = `https://storage.googleapis.com/upload/storage/v1/b/${this.BUCKET_NAME}/o?uploadType=media&name=`;

  constructor(private httpClient: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    // const headers = new HttpHeaders({
    //   'Content-Type': file.type,
    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    // });

    //, { headers }
    return this.httpClient.post(this.UPLOAD_URL + file.name, file);
  
  }
}