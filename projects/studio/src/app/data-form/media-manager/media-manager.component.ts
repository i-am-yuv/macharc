import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.component.html',
  styleUrls: ['./media-manager.component.scss']
})
export class MediaManagerComponent {

  times: number[] = [1, 2, 3, 4,5,6,7,8,9,10];

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      console.log(file);
      // this.http.post('YOUR_BACKEND_API_URL', formData, {
      //   reportProgress: true,
      //   observe: 'events'
      // }).subscribe(event => {
      //   if (event.type === HttpEventType.UploadProgress) {
      //     const progress = Math.round(100 * event.loaded / event.total!);
      //     console.log(`File is ${progress}% uploaded.`);
      //   } else if (event.type === HttpEventType.Response) {
      //     console.log('File uploaded successfully!', event.body);
      //   }
      // }, error => {
      //   console.error('Error uploading file:', error);
      // });
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }
}
