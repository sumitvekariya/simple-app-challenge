import { SafeHtml } from '@angular/platform-browser';

export interface Post {
  text: any;
  id: number;
  createdAt: Date;
  isBeingEdited?: boolean;
}
