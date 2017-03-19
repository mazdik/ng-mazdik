import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'loading-indicator',
  template: `<div [style.visibility]="isLoading ? 'visible': 'hidden'" class="loader"></div>`,
  styleUrls: ['./loading-indicator.css'],
})
export class LoadingIndicatorComponent {
  @Input() public isLoading = false;

  constructor() {
  }

}
