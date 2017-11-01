import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'loading-indicator',
  template: `
    <div [style.visibility]="isLoading ? 'visible': 'hidden'" class="spinner"></div>`,
  styleUrls: ['./loading-indicator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicatorComponent {
  @Input() public isLoading: boolean = false;

  constructor() {
  }

}
