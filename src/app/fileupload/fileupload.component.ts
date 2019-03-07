import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { HttpEventType} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UploadService} from '../services/upload.service';
import {EncoderService} from '../services/encoder.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit, OnDestroy {
  @Input() API_URL: string;
  porcentaje = 0;
  subidaExitosa = false;
  error = false;
  errorMessage = '';
  selected = false;
  @Input() MAX_SIZE: number;
  @Input() fileExtension: string;
  inputFile = new FormControl(null);
  @ViewChild('hiddenInputFile') hiddenInputFile: ElementRef;
  formData: FormData;
  nombreArchivo = '';
  subscription: Subscription;
  subjectSubscription: Subscription;
  myObserver = {
    next: (event) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.porcentaje = Math.round(100 * event.loaded / event.total);
      }
    },
    error: (error) => {
      this.subscription.unsubscribe();
      //this.onReset();
      this.errorMessage = 'Ocurrió un error al subir archivo.';
      this.error = true;
    },
    complete: () => {
      console.log('finalizado subida');
      this.subidaExitosa = true;
      this.subscription.unsubscribe();
    }
  };

  constructor(private uploadService: UploadService,
              private encoderService: EncoderService) {
  }

  ngOnInit() {
    this.uploadService.API_URL = this.API_URL;
    console.log(this.MAX_SIZE);
    console.log(this.fileExtension);
    console.log(this.API_URL);

    this.subjectSubscription = this.encoderService.subject.subscribe(
      (base64: string) => this.formData.append('file', base64),
      (error) => {
        this.error = true;
        this.errorMessage = 'Error al pasear a archivo a base64';
      }
    );
  }

  onSelectFile(files: File[]) {
    console.log(`file: ${files[0].name}, size: ${Math.round(files[0].size / 1024)} MB`);
    this.formData = new FormData();
    Array.from(files).forEach(f => {
      this.encoderService.toBase64(f);
      this.nombreArchivo = f.name;
      this.selected = true;
    });

    if (Math.round(files[0].size / 1024) >= this.MAX_SIZE) {
      this.error = true;
      this.errorMessage = `El archivo no puede ser mayor a ${ this.MAX_SIZE } MB.`;
    }
  }

  onCallHiddenInput() {
    const el: HTMLElement = this.hiddenInputFile.nativeElement as HTMLElement;
    el.click();
  }

  onReset() {
    this.inputFile.reset();
    if (this.formData) {
      this.formData.delete('file');
    }
    this.porcentaje = 0;
    this.subidaExitosa = false;
    this.error = false;
    this.errorMessage = '';
    this.selected = false;
    this.nombreArchivo = '';
  }

  onUploadAndProgress() {
    if (this.formData.has('file')) {
      this.subscription = this.uploadService.uploadFile(this.formData)
        .subscribe(this.myObserver);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subjectSubscription.unsubscribe();
  }
}
