import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  API_URL = '';

  constructor(private http: HttpClient) { }

  uploadFile(formData: FormData) {
    return this.http.post(this.API_URL, formData, {reportProgress: true, observe: 'events'});
  }


}
