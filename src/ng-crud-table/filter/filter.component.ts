import {
  Component, Input, Output, OnInit, EventEmitter, HostBinding, HostListener,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, ColumnModel} from '../types';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public filterDelay: number = 500;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();

  left: number;
  top: number;
  width: number;
  column: ColumnModel = <ColumnModel> {};
  isVisible: boolean;
  selectContainerClicked: boolean;

  @HostBinding('style.position') position = 'absolute';

  @HostBinding('class')
  get cssClass(): any {
    const cls = 'datatable-filter';
    return cls;
  }

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
    return this.width;
  }

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
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

  show(width: number, top: number, left: number, column: ColumnModel) {
    this.column = column;
    this.selectContainerClicked = true;
    this.width = width;
    if (this.top === top && this.left === left) {
      this.toggleDropdown();
    } else {
      this.top = top;
      this.left = left;
      this.closeDropdown();
      this.openDropdown();
    }
  }

  hide() {
    this.closeDropdown();
  }

  clearAllFilters() {
    this.table.filters = {};
    this.filterChanged.emit(this.table.filters);
  }

  onFilterChanged() {
    this.filterChanged.emit(this.table.filters);
  }

  onFilterClose() {
    this.toggleDropdown();
  }

}
