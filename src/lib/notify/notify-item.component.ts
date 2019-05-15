import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy, AfterViewInit, OnDestroy, HostBinding
} from '@angular/core';
import { Message } from './types';

@Component({
  selector: 'app-notify-item',
  template: `
  <div class="dt-notify-title">{{message?.title}}</div>
  <div class="dt-notify-text">{{message?.text}}</div>
  <span class="dt-n-close" (click)="onCloseClick()"></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifyItemComponent implements AfterViewInit, OnDestroy {

  @Input() message: Message;
  @Input() index: number;
  @Output() closeNotify: EventEmitter<any> = new EventEmitter();

  timeout: any;

  @HostBinding('class')
  get cssClass(): string {
    let cls = 'dt-notify-item';
    cls += (this.message.severity) ? ' dt-notify-' + this.message.severity : ' dt-notify-notify';
    return cls;
  }

  constructor() { }

  ngAfterViewInit() {
    this.initTimeout();
  }

  ngOnDestroy() {
    this.clearTimeout();
  }

  initTimeout() {
    if (!this.message.sticky) {
      this.timeout = setTimeout(() => {
        this.closeNotify.emit(this.index);
      }, this.message.life || 3000);
    }
  }

  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  onCloseClick() {
    this.clearTimeout();
    this.closeNotify.emit(this.index);
  }

}
