import { Injectable } from '@angular/core';
import Quill from 'quill';
import QuillAutoLink from '../shared/quillAutolink';




@Injectable()
export class QuillInitializeService {

  constructor() {
    const link = Quill.import('formats/link');
    link.sanitize = (url) => {
      if (url.indexOf('http') <= -1){
        url = 'https://' + url;
      }
      return url;
    }
    Quill.register('modules/autoLink', QuillAutoLink);
  }

}
