import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { DataForm } from '../data-form';
import { MessageService } from '@splenta/vezo';
import { DataFormService } from '../data-form.service';
import { FormBuilder, FormGroup, MinLengthValidator, MinValidator, Validators } from '@angular/forms';
import { GenericComponent } from '../../utils/genericcomponent';


@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.component.html',
  styleUrls: ['./media-manager.component.scss']
})
export class MediaManagerComponent extends GenericComponent {
  data: DataForm[] = [];
  componentName: string = 'DataForm';

  times: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  folders = [
    {
      'id': '0',
      'folderName': 'Macharc'
    },
    {
      'id': '1',
      'folderName': 'Neomaxer'
    }
  ]

  activeFolder: number = 0;
  formData: DataForm = {};
  form!: FormGroup<any>;
  currentView: string = 'grid';


  constructor(private http: HttpClient, private msgService: MessageService, private formService: DataFormService, private fb: FormBuilder) {
    super(formService, msgService);
    this.form = this.fb.group({
      id: '',
      folderName: ['']
    })
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
  isDragging !: boolean;
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


  isNavigationVisible: boolean = false;
  hoveredIndex: number = -1;
  onHoverStart(itemNo: any) {
    this.hoveredIndex = itemNo - 1;
  }
  onHoverEnd() {
    this.isNavigationVisible = false;
    this.hoveredIndex = -1;
  }

  openImageInNewTab(imageUrl: string): void {
    const url = '';
    window.open(imageUrl, '_blank');
  }

  copyToClipbord(imageUrl: string) {

    if (navigator.clipboard) {
      navigator.clipboard.writeText(imageUrl).then(() => {
        this.msgService.add({ severity: 'success', summary: 'Copied', detail: 'URL path copied successfully.' });

      }).catch(err => {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Error occur while copying.' });

      });
    } else {
      this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong.' });
    }
  }

  // newFolder() {
  //   this.form.reset();
  //   this.visible = true;
  //   //this.folders.push(this.folders.length);
  // }

  activeFolderSelect(index: any) {
    this.activeFolder = index;
  }

  override saveData() {
    //this.folders.push(this.folders.length);

    if (this.form.value.id == null || this.form.value.id == '') {
      if (this.form.value.folderName == '' || this.form.value.folderName == null) {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Please enter the folder name' });
      }
      else {
        var folder = {
          'id': this.folders.length + '',
          'folderName': this.form.value.folderName + ''
        };
        this.folders.push(folder);
        this.visible = false;
      }
    }
    else {
      if (this.form.value.folderName == '' || this.form.value.folderName == null) {
        this.msgService.add({ severity: 'error', summary: 'Error', detail: 'Please enter the folder name' });
      }
      else {
        const index = this.folders.findIndex(a => a.id === this.form.value.id);
        if (index !== -1) {
          this.folders[index] = this.form.value;
        }
        this.visible = false;
      }
    }


  }

  people = [
    { name: 'John Doe', age: 30, city: 'New York' },
    { name: 'Jane Smith', age: 25, city: 'Los Angeles' },
    { name: 'Mike Johnson', age: 35, city: 'Chicago' },
    { name: 'Mike Johnson', age: 35, city: 'Chicago' },
    { name: 'Mike Johnson', age: 35, city: 'Chicago' },
    { name: 'Mike Johnson', age: 35, city: 'Chicago' },
    { name: 'Mike Johnson', age: 35, city: 'Chicago' },
    { name: 'Mike Johnson', age: 35, city: 'Chicago' }
  ];

  getBg(clickedView: string) {
    if (clickedView === this.currentView) {
      return '#D9D9D9';
    }
    else {
      return '#F5F6F9';
    }
  }

  // editFolder(folder: any) {
  //   //this.form.patchValue(folder);
  //   //this.form.value.folderName = folder.name;
  //   this.form.patchValue({ ...folder });

  //   //alert(this.form.value.folderName );
  //   this.visible = true;
  // }

  override addData(): void {
    this.form.reset();
    this.visible = true;
  }

  override editData(ds: any): void {
    console.log(ds);
    this.form.patchValue({ ...ds });
    this.visible = true;
  }

}
