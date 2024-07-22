import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '@splenta/vezo/src/public-api';
import { FormBuilder, FormGroup, MinLengthValidator, MinValidator, Validators } from '@angular/forms';
import { GenericComponent } from '../utils/genericcomponent';
import { DataForm } from '../data-form/data-form';
import { DataFormService } from '../data-form/data-form.service';
import { MediaService } from './media.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Asset, Folder } from './folder';
import { GcpUploadService } from './gcp-upload.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';


@Component({
  selector: 'app-media-manager',
  templateUrl: './media-manager.component.html',
  styleUrls: ['./media-manager.component.scss']
})
export class MediaManagerComponent extends GenericComponent implements OnInit {
  data: DataForm[] = [];
  componentName: string = 'DataForm';

  formData: DataForm = {};
  form!: FormGroup<any>;
  currentView: string = 'grid';

  allFolders: Folder[] = [];
  allAssetByFolderId: Asset[] = [];
  filteredAssets: Asset[] = [];
  
  folderId: any;
  loading: boolean = false;
  visibleDeleteConfirmation: boolean = false;
  activeFolder !: Folder ;
  searchQuery: string = '';

  private storage = getStorage(initializeApp(environment.firebaseConfig));


  constructor(private http: HttpClient, private msgService: MessageService, private formService: DataFormService, private fb: FormBuilder,
    private mediaService: MediaService, private route: ActivatedRoute, private router: Router,
    private gcpUploadService: GcpUploadService
  ) {
    super(formService, msgService);
  }

  ngOnInit(): void {
    this.folderId = this.route.snapshot.paramMap.get('id');
    this.form = this.fb.group({
      id: '',
      folderName: ['']
    });
    this.getAllFolders();
    if (this.folderId) {
      this.getFolderAssets(this.folderId);
    }
  }

  getAllFolders() {
    this.mediaService.getAllFolders().then(
      (res: any) => {
        if (res) {
          this.allFolders = res.content;
          this.allFolders.sort((a:any, b:any) => a.folderName.localeCompare(b.folderName));
          if (this.allFolders.length > 0) {
            if (!this.folderId) {
              this.openFolderAssets(this.allFolders[0]);
              this.activeFolder = this.allFolders[0];
            }
          }
        }
        else {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Error while fetching the folders.',
            life: 3000,
          });
        }
      }
    ).catch((err: any) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: err.error.message,
        life: 3000,
      });
    })
  }

  getFolderAssets(folderId: any) {
    this.allAssetByFolderId = [];
    this.filteredAssets = [] ;

    this.loading = true;
    this.mediaService.getAssetsByFolderId(folderId).then(
      (res: any) => {
        if (res) {
          this.allAssetByFolderId = res;
          // lasted asset should comes first so sort like that
          this.allAssetByFolderId.sort((a:any, b:any) => b.updatedAt - a.updatedAt);
          this.loading = false;
        }
        else {
          this.loading = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Error while fetching the Assets.',
            life: 3000,
          });
        }
      }
    ).catch((err: any) => {
      this.loading = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: err.error.message,
        life: 3000,
      });
    })
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const storageRef = ref(this.storage, 'images/' + file.name);
      this.loading = true;
      uploadBytes(storageRef, file)
        .then(snapshot => {
          // console.log('Uploaded a blob or file!', snapshot);
          this.loading = false;
          return getDownloadURL(storageRef);
        })
        .then(downloadURL => {
          // console.log('File available at', downloadURL);
          this.uploadImageToBackend(file, downloadURL)
        })
        .catch(error => {
          console.error('Error uploading file', error);
          this.loading = false;
        });
    }
  }

  asset !: Asset;
  tempFolder !: Folder;

  uploadImageToBackend(file: any, url: any) {
    this.folderId = this.route.snapshot.paramMap.get('id');

    this.tempFolder = {
      id: this.folderId
    };

    this.asset = {
      fileType: file.type,
      fileSize: this.convertFileSizeToKB(file),
      url: url,
      folder: this.tempFolder,
      fileName: file.name,
      uploadedTime: new Date()
    };

    this.mediaService.uploadAssets(this.asset).then(
      (res: any) => {
        if (res) {
          console.log(res);
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Asset uploaded successfully.',
            life: 3000,
          });
          this.getFolderAssets(this.folderId);
        }
        else {
          this.loading = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Something went wrong, Please try again!',
            life: 3000,
          });
        }
      }
    ).catch((err: any) => {
      console.log(err);
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error.message,
        life: 3000,
      });
    })
  }

  convertFileSizeToKB(file: any) {
    const fileSizeInKB = file.size / 1024;
    return fileSizeInKB.toFixed(2) + 'kb';
  }

  // Simple hash function to convert UUID to a number
  convertUuidToNumber(uuid: string): number {
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
      const char = uuid.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
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
      // uploading to bucket
      const storageRef = ref(this.storage, 'images/' + file.name);
      this.loading = true;
      uploadBytes(storageRef, file)
        .then(snapshot => {
          console.log('Uploaded a blob or file!', snapshot);
          this.loading = false;
          return getDownloadURL(storageRef);
        })
        .then(downloadURL => {
          // console.log('File available at', downloadURL);
          this.uploadImageToBackend(file, downloadURL)
        })
        .catch(error => {
          console.error('Error uploading file', error);
          this.loading = false;
        });
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    return allowedTypes.includes(file.type);
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
  currentAssetId: any;
  onHoverStart(asset: any) {
    this.currentAssetId = asset.id;
  }
  onHoverEnd() {
    this.isNavigationVisible = false;
    this.currentAssetId = -1;
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

  openFolderAssets(folder: any) {
    this.router.navigate(['/media-manager/folder/' + folder.id]);
    this.folderId = folder.id;
    this.getFolderAssets(this.folderId);
  }

  override saveData() {
    if (this.form.value.id == null || this.form.value.id == '') {
      // New Folder will be created
      this.mediaService.createFolder(this.form.value).then(
        (res: any) => {
          if (res) {
            this.visible = false;
            this.getAllFolders();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'New folder added.',
              life: 3000,
            });
          }
          else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Something went wrong, Please try again!',
              life: 3000,
            });
          }
        }
      ).catch((err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error occur while adding folder.',
          life: 3000,
        });
      })
    }
    else {
      // Update Folder
      this.mediaService.updateFolder(this.form.value).then(
        (res: any) => {
          if (res) {
            this.visible = false;
            this.getAllFolders();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Folder updated.',
              life: 3000,
            });
          }
          else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Something went wrong, Please try again!',
              life: 3000,
            });
          }
        }
      ).catch((err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error occur while updating folder.',
          life: 3000,
        });
      })
    }
  }

  override deleteData(folder: any) {
    this.activeFolder = folder;
    this.visibleDeleteConfirmation = !this.visibleDeleteConfirmation ;
  }


  getBg(clickedView: string) {
    if (clickedView === this.currentView) {
      return '#D9D9D9';
    }
    else {
      return '#F5F6F9';
    }
  }

  override addData(): void {
    this.form.reset();
    this.visible = true;
  }

  override editData(ds: any): void {
    this.form.patchValue({ ...ds });
    this.visible = true;
  }

  deleteAsset(asset: any) {
    this.mediaService.deleteAsset(asset).then(
      (res: any) => {
        if (res) {
          console.log(res);
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Asset deleted successfully.',
            life: 3000,
          });
          this.getFolderAssets(this.folderId);
        }
        else {
          this.loading = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Something went wrong, Please try again!',
            life: 3000,
          });
        }
      }
    ).catch((err: any) => {
      console.log(err);
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Something went wrong, Please try again!',
        life: 3000,
      });
    })

  }

  deleteFolderConfirmed() {
    if (this.activeFolder.id) {
      this.mediaService.deleteFolder(this.activeFolder).then(
        (res: any) => {
          if (res) {
            this.router.navigate(['/media-manager']);
            this.getAllFolders();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Folder deleted.',
              life: 3000,
            });
          }
          else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: 'Something went wrong, Please try again!',
              life: 3000,
            });
          }
        }
      ).catch((err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error occur while deleting the folder.',
          life: 3000,
        });
      })
    }
  }

  searchAssets()
  {
    if (this.searchQuery) {
      this.filteredAssets = this.allAssetByFolderId.filter(asset =>
        asset.fileName?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredAssets = this.allAssetByFolderId;
    }
  }

  getAssetList()
  {
    if( this.searchQuery)
    {
       return this.filteredAssets ;
    }
    else{
         return this.allAssetByFolderId;
    } 
  }

}
