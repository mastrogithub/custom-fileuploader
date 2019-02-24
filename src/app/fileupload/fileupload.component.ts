import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpEventType, HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  porcentaje = 0;
  subidaExitosa = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  upload(files: File[]) {
    console.log('llamada a upload');
    this.uploadAndProgress(files);
  }

  basicUpload(files: File[]) {
    console.log(files);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f));

    this.http.post('http://localhost:3000/upload', formData)
      .subscribe(
        event => {
          console.log('finalizado');
          this.subidaExitosa = true;
        }
      );
  }

  uploadAndProgress(files: File[]) {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f));

    this.http.post('http://localhost:3000/upload', formData, {reportProgress: true, observe: 'events'})
      .subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.porcentaje = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            console.log('finalizado');
            this.subidaExitosa = true;
          }
        }
      );
  }

}
