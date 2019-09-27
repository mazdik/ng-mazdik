import {
  Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, OnDestroy, HostBinding
} from '@angular/core';
import { NotifyService } from './notify.service';
import { Subscription } from 'rxjs';
import { Message, PositionType } from './types';

@Component({
  selector: 'app-notify',
  template: `
    <app-notify-item *ngFor="let msg of messages; let i=index" [message]="msg" [index]="i"
    (closeNotify)="onCloseNotify($event)"></app-notify-item>
`,
  styleUrls: ['notify.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NotifyComponent implements OnDestroy {

  @Input() position: PositionType;

  @HostBinding('class')
  get cssClass(): string {
    let cls = 'dt-notify-container';
    cls += (this.position) ? ' dt-n-' + this.position : ' dt-n-top-right';
    return cls;
  }

  messages: Message[] = [];
  subscription: Subscription;

  constructor(private cd: ChangeDetectorRef, private notifyService: NotifyService) {
    this.subscription = this.notifyService.getMessage().subscribe(message => {
      this.messages.push(message);
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCloseNotify(event) {
    this.messages.splice(event.index, 1);
  }

}
