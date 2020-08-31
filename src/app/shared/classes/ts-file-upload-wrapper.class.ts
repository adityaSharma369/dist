import {ApiService} from '../services/api.service';
import {CommonService} from '../services/common.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';

export interface TsFileUploadConfig {
  file: File;
  allowed_types: string[];
  generatePreview: boolean;
  extraPayload: object;
  uploadUrl: string;
  fileFieldName: string;
}

export class TsFileUploadWrapperClass {
  file: File | any;
  files: File[] | any[];
  protected allowed_types: string[] = ['gif', 'png', 'jpg', 'jpeg'];
  protected generatePreview = false;
  protected uploadUrl = '';
  protected fileFieldName = 'file';
  protected extraPayload = {};

  uploadText = 'Starting';
  uploadProgress = '0%';
  uploadProgressCls = 'blue_cls';
  uploadDone = false;
  uploadId;

  constructor(config: TsFileUploadConfig | any = {}, private _apiService: ApiService) {

    if (config.allowed_types && config.allowed_types.length > 0) {
      this.allowed_types = config.allowed_types;
    }
    if (config.uploadUrl) {
      this.uploadUrl = config.uploadUrl;
    } else {
      this.onError('Endpoint not defined', 'error');
    }
    if (config.file) {
      this.file = config.file;
    } else if (config.files) {
      this.files = config.files;
    } else {
      this.onError('file / files not defined', 'error');
    }
    if (config.fileFieldName) {
      this.fileFieldName = config.fileFieldName;
    }
    if (config.generatePreview) {
      this.generatePreview = config.generatePreview;
    }
    if (config.extraPayload) {
      this.extraPayload = config.extraPayload;
    }

    this.prepareFiles();
  }

  static getExtension(fileName) {
    return fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
  }

  onError(err, heading) {

  }

  onSuccess(status) {

  }

  onProgress() {
  }

  onFilesReady() {
  }

  checkAndPrepareFile(file: File | any, cb) {
    const ext = TsFileUploadWrapperClass.getExtension(file.name);
    if (this.allowed_types.indexOf(ext) > -1) {
      this.uploadId = CommonService.getRandomID(5);
      this.uploadDone = false;
      if (this.generatePreview) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          file.base64 = fileReader.result;
          cb(file);
        };
        fileReader.readAsDataURL(file);
      } else {
        cb(file);
      }
    } else {
      this.onError('Only allowed ' + this.allowed_types.join(',') + '.', 'Not Allowed');
      cb(false);
    }
  }

  prepareFiles() {
    if (this.file) {
      this.checkAndPrepareFile(this.file, (file) => {
        if (file) {
          this.file = file;
          this.onFilesReady();
        }
      });
    } else if (this.files) {
      this.files.forEach((rawFile, index) => {
        this.checkAndPrepareFile(rawFile, (file, i) => {
          if (file) {
            this.files[index] = file;
            console.log(i === this.files.length, i, this.files.length);
            if (i === this.files.length - 1) {
              this.onFilesReady();
            }
          }
        });
      });
    }
  }

  startUpload() {
    const formData = new FormData();
    for (const field in this.extraPayload) {
      if (this.extraPayload.hasOwnProperty(field)) {
        formData.append(field, this.extraPayload[field]);
      }
    }
    if (this.file) {
      formData.append(this.fileFieldName, this.file, this.file.name);
    } else {
      this.files.forEach((file) => {
        formData.append(this.fileFieldName, file, file.name);
      });
    }
    this._apiService.upload(this.uploadUrl, formData, {
      'Content-Type': false,
      Accept: 'application/json'
    }, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe((event: HttpEvent<any> | any) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.uploadText = 'Starting';
              this.uploadProgress = '0%';
              this.uploadProgressCls = 'blue_cls';
              this.onProgress();
              break;
            case HttpEventType.Response:
              const resp = event.body;
              this.uploadText = 'Completed';
              this.uploadProgressCls = 'green_cls';
              this.uploadDone = true;
              this.uploadProgress = '100%';
              this.onSuccess(resp.data);
              break;
            case 1: {
              const uploadedPercentage = event.loaded / event.total * 100;
              const uploadedPercentageRound = Math.round(uploadedPercentage) + '%';
              if (this.uploadProgress !== uploadedPercentageRound) {
                this.uploadText = 'Uploading..';
                this.uploadProgressCls = 'blue_cls';
                this.uploadProgress = uploadedPercentageRound;
                this.onProgress();
              }
              break;
            }
          }
        },
        error => {
          this.uploadText = 'Error';
          this.uploadProgressCls = 'red_cls';
          this.uploadProgress = '100%';
          this.uploadDone = false;
          // console.log(error);
          // this.onError(error.errors || 'Something went wrong!', 'error');
        });
  }
}


/// Example code to upload with wrapper

// filesUploads: TsFileUploadWrapperClass;
// filesSelected(files: any[]) {
//   console.log('files', files);
//   console.log('files selected', files.length);
//   // files is a FileList of File objects. List some properties.
//   // const output = [];
//   this.images = [];
//   files = Array.from(files);
//   const uploadConfig: TsFileUploadConfig | any = {
//     files,
//     fileFieldName: 'image',
//     generatePreview: true,
//     uploadUrl: '/profile/upload',
//     allowed_types: ['png', 'jpg'],
//     extraPayload: {name: 'Santhosh', city: 'hyderabad'}
//   };
//   this.filesUploads = new TsFileUploadWrapperClass(uploadConfig, this._common._api);
//
//   this.filesUploads.onError = (err, heading) => {
//     console.log(err, heading);
//     this._common._alert.showAlert(err, 'error', heading);
//   };
//   this.filesUploads.onSuccess = ((status) => {
//     console.log(status);
//   });
//   this.filesUploads.onProgress = (() => {
//     console.log('progress');
//   });
//   this.filesUploads.startUpload();
// }
