import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  uploadFile(formData: FormData) {
    return this.http.post(`${this.API_URL}/upload`, formData, {reportProgress: true, observe: 'events'});
  }
}
