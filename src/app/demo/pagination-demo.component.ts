import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-demo',
  template: `
    <app-pagination class="pagination-demo"
      [totalItems]="100"
      [perPage]="10"
      [currentPage]="1"
      [pageSizeOptions]="[10, 20, 30, 50]"
      (pageChanged)="onPageChanged($event)">
    </app-pagination>
  `,
  styles: [`.pagination-demo {width: 30em;}`]
})
export class PaginationDemoComponent {
  constructor() { }

  onPageChanged(event) {
    console.log(event);
  }
}
