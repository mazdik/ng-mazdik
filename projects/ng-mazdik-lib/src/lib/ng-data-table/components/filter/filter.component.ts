import {
  Component, Input, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef,
  OnDestroy, ElementRef
} from '@angular/core';
import {Column, DataTable} from '../../base';
import {Subscription} from 'rxjs';
import {ColumnMenuEventArgs} from '../../base/types';
import {DropDown} from '../../../dropdown/drop-down';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  left: number;
  top: number;
  column: Column = new Column({});

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
    return (this.dropdown.isOpen && this.column.filter) ? 'block' : 'none';
  }

  dropdown: DropDown;
  private subscriptions: Subscription[] = [];

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
    this.dropdown = new DropDown(this.element.nativeElement);
  }

  ngOnInit() {
    const subColumnMenu = this.table.events.columnMenuSource$.subscribe((event) => {
      this.show(event);
    });
    const subScroll = this.table.events.scrollSource$.subscribe(() => {
      this.hide();
    });
    const subDropdown = this.dropdown.isOpenSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subColumnMenu);
    this.subscriptions.push(subScroll);
    this.subscriptions.push(subDropdown);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.dropdown.removeEventListeners();
  }

  show(event: ColumnMenuEventArgs) {
    this.element.nativeElement.style.width = this.table.dimensions.columnMenuWidth + 'px';
    this.column = event.column;
    this.dropdown.selectContainerClicked = true;
    if (this.top === event.top && this.left === event.left) {
      this.dropdown.toggleDropdown();
    } else {
      this.top = event.top;
      this.left = event.left;
      this.dropdown.closeDropdown();
      this.dropdown.openDropdown();
    }
  }

  hide() {
    this.dropdown.closeDropdown();
  }

  onFilterClose() {
    this.dropdown.toggleDropdown();
  }

  get isListFilter(): boolean {
    if (this.column.options || this.column.filterValues) {
      return true;
    }
    return false;
  }

  get isRangeFilter(): boolean {
    if (!this.isListFilter && (this.column.type === 'number' || this.column.isDateType)) {
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
