import {
  Component, Output, EventEmitter, Input, ChangeDetectionStrategy, HostBinding
} from '@angular/core';
import {PageEvent} from './types';

@Component({
  selector: 'app-pagination',
  templateUrl: 'pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {

  @Input()
  get perPage(): number { return this._perPage; }
  set perPage(value: number) {
    this._perPage = value;
    this.pages = this.getPages();
  }
  private _perPage: number = 10;

  @Input()
  get totalItems(): number { return this._totalItems; }
  set totalItems(value: number) {
    this._totalItems = value;
    this.pages = this.getPages();
  }
  private _totalItems: number = 0;

  @Input()
  get currentPage(): number { return this._currentPage; }
  set currentPage(value: number) {
    const _previous = this._currentPage;
    this._currentPage = (value > this.totalPages()) ? this.totalPages() : (value || 1);

    if (_previous === this._currentPage || typeof _previous === 'undefined') {
      return;
    }
    this.pages = this.getPages();
  }
  private _currentPage: number = 1;

  @Input()
  get pageSizeOptions(): number[] { return this._pageSizeOptions; }
  set pageSizeOptions(value: number[]) {
    this._pageSizeOptions = (value || []).sort((a, b) => a - b);
  }
  private _pageSizeOptions: number[] = [];

  @Output() pageChanged = new EventEmitter();

  pages: number[];

  @HostBinding('class.pagination') cssClass = true;

  setPage(page: number, event ?: MouseEvent): void {
    if (event) {
      event.preventDefault();
    }

    if (event && event.target) {
      const target: any = event.target;
      target.blur();
    }
    if (page > 0 && page <= this.totalPages() && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChanged.emit({currentPage: this.currentPage, perPage: this.perPage} as PageEvent);
    }
  }

  totalPages(): number {
    const totalPages = this.perPage < 1 ? 1 : Math.ceil(this.totalItems / this.perPage);
    return Math.max(totalPages || 0, 1);
  }

  getPages(): number[] {
    const maxSize = 3;
    const pages: number[] = [];
    let startPage = 1;
    const totalPages = this.totalPages();
    let endPage = totalPages;

    if (maxSize < totalPages) {
      startPage = Math.max(this.currentPage - Math.floor(maxSize / 2), 1);
      endPage = startPage + maxSize - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxSize + 1;
      }
    }
    for (let num = startPage; num <= endPage; num++) {
      pages.push(num);
    }
    return pages;
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) { return `0 of ${length}`; }

    length = Math.max(length, 0);

    const startIndex = (page - 1) * pageSize;

    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} of ${length}`;
  }

  onChangePageSize(pageSize: number) {
    this.perPage = pageSize;
    this.currentPage = this._currentPage;
    this.pageChanged.emit({currentPage: this.currentPage, perPage: this.perPage} as PageEvent);
  }

}
