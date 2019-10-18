import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {KeyValuePair} from './types';

@Component({
  selector: 'app-row-view',
  templateUrl: './row-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowViewComponent {

  @Input() transposedData: KeyValuePair[];
  @Input() headerKeyMessage: string = 'Key';
  @Input() headerValueMessage: string = 'Value';

  order: string;
  reverse: boolean = true;

  constructor() {}

  setOrder(name: string) {
    if (this.order === name) {
      this.reverse = !this.reverse;
    }
    this.order = name;
  }

  isOrder(name: string) {
    return this.order === name && this.reverse;
  }

  isOrderReverse(name: string) {
    return this.order === name && !this.reverse;
  }

}
