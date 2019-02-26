import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-filedownload',
  templateUrl: './filedownload.component.html',
  styleUrls: ['./filedownload.component.css']
})
export class FiledownloadComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onDownloadFile() {

    return this.http
      .get<{
        url: string,
        nombreArchivo: string
      }>('http://localhost:3000/download')
      .pipe(
        tap((res) => console.log(res))
      )
      .subscribe((resp) => {
        console.log('start download:', resp);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = resp.url;
        a.download = resp.nombreArchivo;
        a.click();
        a.remove(); // remove the element
      }, error => {
        console.log('download error:', JSON.stringify(error, undefined, 2));
      }, () => {
        console.log('Completed file download.');
      });
  }
}
