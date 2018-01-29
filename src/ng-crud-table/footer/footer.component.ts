import {Component, Output, EventEmitter, Input, ChangeDetectionStrategy, HostBinding} from '@angular/core';

@Component({
  selector: 'app-datatable-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {

  @Input() footerHeight: number;
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() currentPage: number;
  @Output() pageChanged: EventEmitter<any> = new EventEmitter();

  @HostBinding('class') cssClass = 'datatable-footer';

  onPageChanged(event) {
    this.pageChanged.emit(event);
    this.currentPage = event;
  }

  rowCount() {
    const count = this.itemsPerPage * this.currentPage;
    return (count < this.totalItems) ? count : this.totalItems;
  }

}
