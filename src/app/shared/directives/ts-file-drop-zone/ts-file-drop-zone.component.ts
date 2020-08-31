import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ts-file-drop-zone',
  templateUrl: './ts-file-drop-zone.component.html',
  styleUrls: ['./ts-file-drop-zone.component.scss']
})
export class TsFileDropZoneComponent implements OnInit {
  isDragOver = false;
  @Output() OnFileSelected: EventEmitter<File[]> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'none';
    this.isDragOver = false;
    const files = evt.dataTransfer.files; // FileList object.
    this.filesSelected(files);
  }

  handleFileInputSelect(e) {
    const files = e.target.files; // FileList object.
    this.filesSelected(files);
    e.target.value = null;
  }

  filesSelected(files: any[]) {
    files = Array.from(files);
    this.OnFileSelected.emit(files);
  }

  handleDragLeave(e) {
    this.isDragOver = false;
    e.dataTransfer.dropEffect = 'none';
  }

  handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    this.isDragOver = true;
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }
}


// thumbnailify(base64Image, targetSize, callback) {
//   const img = new Image();
//
//   img.onload = () => {
//     const width = img.width;
//     const height = img.height;
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//
//     canvas.width = canvas.height = targetSize;
//
//     ctx.drawImage(
//       img,
//       width > height ? (width - height) / 2 : 0,
//       height > width ? (height - width) / 2 : 0,
//       width > height ? height : width,
//       width > height ? height : width,
//       0, 0,
//       targetSize, targetSize
//     );
//
//     callback(canvas.toDataURL());
//   };
//
//   img.src = base64Image;
// }
// this.thumbnailify(fileReader.result, 40, (base64Thumbnail) => {
//   file.base64 = base64Thumbnail;
// });

// const reader = CommonService.createBlobUrlWithText('self.onmessage = function(e) { ' +
//   'let file = e.data; const fileReader = new FileReader(); ' +
//   'fileReader.onload = () => { const base64 = fileReader.result; self.postMessage(base64); }; ' +
//   'fileReader.readAsDataURL(file);' +
//   ' };');
// const worker = new Worker(reader);
// worker.onmessage = e => {
//   worker.terminate();
//   file.base64 = e.data;
//   this.images.push(file);
//   this._cdRef.detectChanges();
//   if (files.length === this.images.length) {
//     console.log('done reading all images');
//   }
// };
// worker.postMessage(file);

// output.push('<li><strong>', escape(file.name), '</strong> (', file.type || 'n/a', ') - ',
//   CommonService.formatSizeUnits(file.size), ', size:', CommonService.getBytesInMB(file.size), ', last modified: ',
//   file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a',
//   '</li>');
