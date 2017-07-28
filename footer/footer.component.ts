import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'datatable-footer',
  templateUrl: './footer.component.html',
  host: {
    class: 'datatable-footer'
  }
})
export class FooterComponent {

  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();

  currentPage: number = 1;

  onPageChanged(event) {
    this.pageChanged.emit(event);
    this.currentPage = event;
  }

  rowCount() {
    let count = this.itemsPerPage * this.currentPage;
    return (count < this.totalItems) ? count : this.totalItems;
  }

}
