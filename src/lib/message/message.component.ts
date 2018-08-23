import {Component, Input, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';

  @Component({
    selector: 'dt-message',
    template: ` <div *ngIf="text" [ngClass]="getClass()" [innerHTML]="text"></div>`,
    styleUrls: ['message.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
  })
  export class MessageComponent {

    @Input() severity: 'danger' | 'success';
    @Input() text: string;

    getClass() {
      return this.severity ? 'dt-message dt-message-' + this.severity : null;
    }

  }
