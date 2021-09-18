import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../..';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadService } from '../upload.service';
import { getUploadConfig, UploadConfig } from '../../../constants';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDialogComponent implements OnInit {

  @ViewChild('fileElement') fileElement: ElementRef<HTMLInputElement>;

  public uploadConfig: UploadConfig = null;

  public file: File = null;
  public inProgress = false;
  public uploadResponse: any = null;
  public fileUploaded: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private uploadSrvc: UploadService, private alrtSrvc: AlertService, private changeDetRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.uploadConfig = getUploadConfig(this.data.ModuleType);
  }

  onFileSelect() {

    this.uploadResponse = null;
    this.fileUploaded = false;

    if (this.fileElement.nativeElement.files.length > 0) {
      this.file = this.fileElement.nativeElement.files[0];
    } else {
      this.file = null;
    }
  }

  addFiles() {
    this.fileElement.nativeElement.click();
  }

  uploadFile() {

    if (this.uploadConfig.confirmation) {
      this.alrtSrvc.showConfirmAlert(this.uploadConfig.confirmationMessage).afterClosed().subscribe((confirm) => {
        if (confirm) {
          this.upload();
        }
      });
    } else {
      this.upload();
    }

  }

  private upload() {

    if (this.inProgress) {
      return false;
    }

    this.inProgress = true;
    this.uploadResponse = null;

    this.uploadSrvc.upload(this.file, this.uploadConfig.url).subscribe((resp) => {

      this.inProgress = false;
      this.fileUploaded = true;

      if (resp.status === 0 || resp.status === 1) {
        this.alrtSrvc.showSuccessAlert(resp.message);
      } else {
        this.alrtSrvc.showErrorAlert(resp.message);
      }

      delete resp.status;
      delete resp.message;

      this.uploadResponse = resp;

      this.changeDetRef.detectChanges();

    }, (error) => {

      this.inProgress = false;
      this.alrtSrvc.showErrorAlert(error);

    });

  }

}
