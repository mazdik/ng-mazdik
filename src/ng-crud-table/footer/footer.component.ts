import {Component, Output, EventEmitter, Input, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'datatable-footer',
  templateUrl: './footer.component.html',
  host: {
    class: 'datatable-footer'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  @Input() footerHeight: number;
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() currentPage: number;
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();

  onPageChanged(event) {
    this.pageChanged.emit(event);
    this.currentPage = event;
  }

  rowCount() {
    const count = this.itemsPerPage * this.currentPage;
    return (count < this.totalItems) ? count : this.totalItems;
  }

}
