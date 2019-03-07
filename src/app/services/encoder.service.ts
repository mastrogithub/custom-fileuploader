import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncoderService {
  subject = new Subject<string | ArrayBuffer>();
  constructor() {}

  toBase64(file: File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.subject.next(reader.result);
        //this.subject.complete();
      };
      reader.onerror = (err) => this.subject.error(err);
  }

}
