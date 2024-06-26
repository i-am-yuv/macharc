import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.component.html',
  styleUrls: ['./media-manager.component.scss']
})
export class MediaManagerComponent {

  times: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private http: HttpClient) {
   }

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

  // Logic of Drag and drop image
  isDragging !:boolean ;
  imageSrc: any;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file && this.isValidFileType(file)) {
      this.readImage(file);
    }
  }
  private isValidFileType(file: File): boolean {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    return allowedTypes.includes(file.type);
  }

  onFileSelected1(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.readImage(file);
    }
  }

  private readImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.imageSrc = e.target?.result;
      this.uploadImage(file);
    };
    reader.readAsDataURL(file);
  }

  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log(file);
    // fetch('https://your-backend-api/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log('Success:', data);
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //   });
  }
  

  isNavigationVisible : boolean = false ;
  hoveredIndex : number = -1 ;
  onHoverStart( itemNo : any )
  {
       this.hoveredIndex = itemNo - 1 ;
  }
  onHoverEnd()
  {
    this.isNavigationVisible  = false ;
    this.hoveredIndex = -1 ;
  }
}
