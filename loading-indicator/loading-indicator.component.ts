import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'loading-indicator',
  template: `<div [style.visibility]="isLoading ? 'visible': 'hidden'" class="spinner"></div>`,
  styleUrls: ['./loading-indicator.css'],
})
export class LoadingIndicatorComponent {
  @Input() public isLoading: boolean = false;

  constructor() {
  }

}
