import { Component } from '@angular/core';
import { NotifyService } from 'ng-mazdik-lib';

@Component({
  selector: 'app-notify-demo',
  template: `
    <button class="dt-button" (click)="error()">Error</button>&nbsp;
    <button class="dt-button" (click)="info()">Info</button>&nbsp;
    <button class="dt-button" (click)="notify()">Notify</button>&nbsp;
    <button class="dt-button" (click)="success()">Success</button>&nbsp;
    <button class="dt-button" (click)="warning()">Warning</button>
  `
})
export class NotifyDemoComponent {

  constructor(private notifyService: NotifyService) { }

  error() {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test1', severity: 'error'});
  }

  info() {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test2', severity: 'info'});
  }

  notify() {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test3', severity: 'notify'});
  }

  success() {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test4', severity: 'success'});
  }

  warning() {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test5', severity: 'warning'});
  }

}
