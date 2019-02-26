import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpEventType, HttpResponse} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {UploadService} from '../services/upload.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit, OnDestroy {
  porcentaje = 0;
  subidaExitosa = false;
  error = false;
  errorMessage = '';
  selected = false;
  readonly MAX_SIZE = 50;
  inputFile = new FormControl(null);
  @ViewChild('hiddenInputFile') hiddenInputFile: ElementRef;
  formData: FormData;
  nombreArchivo = '';
  subscription: Subscription;
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

  constructor(private uploadService: UploadService) {
  }

  ngOnInit() {
  }

  onSelectFile(files: File[]) {
    console.log(`file: ${files[0].name}, size: ${Math.round(files[0].size / 1024)} MB`);
    this.formData = new FormData();
    Array.from(files).forEach(f => {
      this.toBase64(f)
        .then((base64: string) => {
          this.formData.append('file', base64);
        })
        .catch((error) => {
          this.error = true;
          this.errorMessage = 'Error al pasear a archivo a base64'
        });
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
  }

  toBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
    });
  }

}
