import {
  Component, Input, OnInit, HostBinding, HostListener, ChangeDetectionStrategy, ChangeDetectorRef,
  OnDestroy, ElementRef
} from '@angular/core';
import {Column, DataTable, Keys} from '../../base';
import {Subscription} from 'rxjs';
import {ColumnMenuEventArgs} from '../../base/types';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  left: number;
  top: number;
  column: Column = <Column>{};
  isVisible: boolean;
  selectContainerClicked: boolean;

  @HostBinding('class') cssClass = 'dropdown-filter-menu';

  @HostBinding('style.left.px')
  get getLeft(): number {
    return this.left;
  }

  @HostBinding('style.top.px')
  get getTop(): number {
    return this.top;
  }

  @HostBinding('style.width.px')
  get getWidth(): number {
    return this.table.dimensions.columnMenuWidth;
  }

  @HostBinding('style.display')
  get getDisplay(): string {
    return (this.isVisible && this.column.filter) ? 'block' : 'none';
  }

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef, private element: ElementRef) {
  }

  ngOnInit() {
    const subColumnMenu = this.table.events.columnMenuSource$.subscribe((event) => {
      this.show(event);
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      this.hide();
    });
    this.subscriptions.push(subColumnMenu);
    this.subscriptions.push(subScroll);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.selectContainerClicked = true;
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: MouseEvent): void {
    if (!this.selectContainerClicked) {
      this.closeDropdown();
    }
    this.selectContainerClicked = false;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === Keys.ESCAPE) {
      this.closeDropdown();
    }
  }

  toggleDropdown() {
    this.isVisible ? this.closeDropdown() : this.openDropdown();
  }

  openDropdown() {
    if (!this.isVisible && this.column.filter) {
      this.isVisible = true;
    }
  }

  closeDropdown() {
    if (this.isVisible) {
      this.isVisible = false;
      this.cd.markForCheck();
    }
  }

  show(event: ColumnMenuEventArgs) {
    this.element.nativeElement.style.width = this.table.dimensions.columnMenuWidth + 'px';
    this.column = event.column;
    this.selectContainerClicked = true;
    if (this.top === event.top && this.left === event.left) {
      this.toggleDropdown();
    } else {
      this.top = event.top;
      this.left = event.left;
      this.closeDropdown();
      this.openDropdown();
    }
  }

  hide() {
    this.closeDropdown();
  }

  onFilterClose() {
    this.toggleDropdown();
  }

  get isListFilter(): boolean {
    if (this.column.options || this.column.filterValuesFunc) {
      return true;
    }
    return false;
  }

  get isRangeFilter(): boolean {
    if (!this.isListFilter &&
        (this.column.type === 'number' || this.column.type === 'date' || this.column.type === 'datetime-local')) {
      return true;
    }
    return false;
  }

  get isStringFilter(): boolean {
    if (!this.isListFilter && !this.isRangeFilter) {
      return true;
    }
    return false;
  }

}
