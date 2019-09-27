import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from './types';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {

  private subject = new Subject<any>();

  sendMessage(message: Message) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
