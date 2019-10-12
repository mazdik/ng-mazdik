import { Component } from '@angular/core';

@Component({
  selector: 'app-pagination-demo',
  template: `
    <app-pagination
      [totalItems]="100"
      [perPage]="10"
      [currentPage]="1"
      [pageSizeOptions]="[10, 20, 30, 50]"
      (pageChanged)="onPageChanged($event)">
    </app-pagination>
  `,
  styles: [`app-pagination {width: 500px}`]
})
export class PaginationDemoComponent {
  constructor() { }

  onPageChanged(event) {
    console.log(event);
  }
}
