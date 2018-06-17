import {
  Component, Input, OnInit, HostBinding, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy
} from '@angular/core';
import {Column, DataTable} from '../../base';
import {Subscription} from 'rxjs';
import {ColumnMenuEventArgs} from '../../types';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() public table: DataTable;

  left: number;
  top: number;
  right: number;
  width: number;
  column: Column = <Column> {};
  isVisible: boolean;
  selectContainerClicked: boolean;

  @HostBinding('class') cssClass = 'datatable-filter';
  @HostBinding('style.position') position = 'absolute';

  @HostBinding('style.left.px')
  get getLeft(): number {
    return this.left;
  }

  @HostBinding('style.top.px')
  get getTop(): number {
    return this.top;
  }

  @HostBinding('style.right.px')
  get getRight(): number {
    return this.right;
  }

  @HostBinding('style.width.px')
  get getWidth(): number {
    return this.width;
  }

  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {
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
    const ESCAPE_KEYCODE = 27;
    const keyCode = event.keyCode;

    if (keyCode === ESCAPE_KEYCODE) {
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
    this.column = event.column;
    this.selectContainerClicked = true;
    this.width = this.table.dimensions.columnMenuWidth;
    if (this.top === event.top && this.left === event.left && this.right === event.right) {
      this.toggleDropdown();
    } else {
      this.top = event.top;
      this.left = event.left;
      this.right = event.right;
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

}
