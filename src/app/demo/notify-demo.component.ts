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

  error(): void {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test1', severity: 'error'});
  }

  info(): void {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test2', severity: 'info'});
  }

  notify(): void {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test3', severity: 'notify'});
  }

  success(): void {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test4', severity: 'success'});
  }

  warning(): void {
    this.notifyService.sendMessage({title: 'HttpErrorResponse', text: 'test5', severity: 'warning'});
  }

}
