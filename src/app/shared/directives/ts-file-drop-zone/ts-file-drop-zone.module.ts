import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TsFileDropZoneComponent} from './ts-file-drop-zone.component';
import {MatButtonModule} from '@angular/material';

@NgModule({
  declarations: [
    TsFileDropZoneComponent
  ],
  imports: [
    CommonModule, MatButtonModule
  ], exports: [TsFileDropZoneComponent]
})
export class TsFileDropZoneModule {
}


/// Example code to use upload and dropzone

// <ts-file-drop-zone (OnFileSelected)="filesSelected($event)"></ts-file-drop-zone>
//   <div class="" *ngIf="filesUploads">
// <div class="mrg-5 pull-left position-relative" *ngFor="let img of filesUploads.files">
// <div *ngIf="filesUploads.uploadId && !filesUploads.uploadDone;"
// class="image_upload_status id_{{filesUploads.uploadId}}">
// <div class="image_upload_text id_{{filesUploads.uploadId}}">{{filesUploads.uploadText || 'Pending'}}</div>
// <div class="image_upload_progress id_{{filesUploads.uploadId}} bdr_btm_{{filesUploads.uploadProgressCls}}"
//   [ngStyle]="{width: filesUploads.uploadProgress}"></div>
// </div>
// <img [src]="img.base64? img.base64 : 'assets/images/image-placeholder.jpg'" width="40" height="30">
//   </div>
//   </div>
