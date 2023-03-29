import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileuploadComponent } from './fileupload.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FileuploadComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    FileuploadComponent
  ]
})
export class FileuploadModule { }
