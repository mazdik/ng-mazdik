import { Component, Output, EventEmitter, Input } from "@angular/core";

@Component({
    selector: "pagination",
    template: `
  <ul class="pagination">
    <li class="pagination-first page-item"
        [class.disabled]="currentPage===1">
      <a class="page-link" href (click)="setPage(1, $event)">&laquo;</a>
    </li>
    <li class="pagination-prev page-item"
        [class.disabled]="currentPage===1">
      <a class="page-link" href (click)="setPage(currentPage - 1, $event)">&lsaquo;</a>
      </li>
    <li *ngFor="let page of getPages()"
        [ngClass]="{active:currentPage === page}"
        class="pagination-page page-item">
      <a class="page-link" href (click)="setPage(page, $event)">{{page}}</a>
    </li>
    <li class="pagination-next page-item"
        [class.disabled]="currentPage===calculateTotalPages()">
      <a class="page-link" href (click)="setPage(currentPage + 1, $event)">&rsaquo;</a></li>
    <li class="pagination-last page-item"
        [class.disabled]="currentPage===calculateTotalPages()">
      <a class="page-link" href (click)="setPage(calculateTotalPages(), $event)">&raquo;</a></li>
  </ul>
  `
})
export class PaginationComponent {

    protected _currentPage: number = 1;
    protected _itemsPerPage: number = 10;
    protected _totalItems: number = 0;

    @Output() pageChanged = new EventEmitter();

    @Input()
    public get itemsPerPage(): number {
        return this._itemsPerPage;
    }

    public set itemsPerPage(value: number) {
        this._itemsPerPage = value;
        this.setPage(this.currentPage);
    }

    @Input()
    public get totalItems(): number {
        return this._totalItems;
    }

    public set totalItems(value: number) {
        this._totalItems = value;
        this.setPage(this.currentPage);
    }

    @Input()
    public get currentPage(): number {
        return this._currentPage;
    }

    public set currentPage(value: number) {
        const _previous = this._currentPage;
        this._currentPage = (value > this.calculateTotalPages()) ? this.calculateTotalPages() : (value || 1);

        if (_previous === this._currentPage || typeof _previous === 'undefined') {
            return;
        }

        this.pageChanged.emit(this._currentPage);
    }

    public setPage(page: number, event ? : MouseEvent): void {
        if (event) {
            event.preventDefault();
        }

        if (event && event.target) {
            let target: any = event.target;
            target.blur();
        }
        this.currentPage = page;
    }

    public calculateTotalPages(): number {
        let totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil(this.totalItems / this.itemsPerPage);
        return Math.max(totalPages || 0, 1);
    }

    public getPages(): any[] {
        let maxSize: number = 10;
        let pages: any[] = [];
        let startPage = 1;
        let totalPages = this.calculateTotalPages();
        let endPage = totalPages;
        let isMaxSized = typeof maxSize !== 'undefined' && maxSize < totalPages;

        if (isMaxSized) {
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

}
