import {
  Component, Input, Output, OnInit, EventEmitter, ViewChild, HostBinding, HostListener,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, ColumnModel, ISelectOption} from '../types';
import {isBlank} from '../utils/util';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit {

  @Input() public table: DataTable;
  @Input() public filterDelay: number = 500;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('searchFilterInput') searchFilterInput: any;

  left: number;
  top: number;
  width: number;
  column: ColumnModel = <ColumnModel> {};
  selectionLimit: number = 1;
  selectedOptions: any[];
  columnsSelectedOptions: any[] = [];
  numSelected: number = 0;
  isVisible: boolean;
  searchFilterText: string = '';
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

  clearSearch() {
    this.searchFilterText = '';
  }

  toggleDropdown() {
    this.isVisible ? this.closeDropdown() : this.openDropdown();
  }

  openDropdown() {
    if (!this.isVisible && this.column.filter) {
      this.isVisible = true;
      if (this.column.options) {
        setTimeout(() => {
          this.searchFilterInput.nativeElement.focus();
        }, 1);
      }
    }
  }

  closeDropdown() {
    if (this.isVisible) {
      this.clearSearch();
      this.isVisible = false;
      this.cd.markForCheck();
    }
  }

  setSelectedOptions(value: any) {
    if (!this.selectedOptions) {
      this.selectedOptions = [];
    }
    const index = this.selectedOptions.indexOf(value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      if (this.selectionLimit === 0 || this.selectedOptions.length < this.selectionLimit) {
        this.selectedOptions.push(value);
      } else {
        this.selectedOptions.push(value);
        this.selectedOptions.shift();
      }
    }
  }

  setSelected(value: any) {
    this.setSelectedOptions(value);
    this.filter(this.selectedOptions[0], this.column.name, null); // [0] todo multi
    this.toggleDropdown();
  }

  checkAll() {
    this.selectedOptions = this.column.options.map(option => option.id);
    this.filter(this.selectedOptions[0], this.column.name, null); // [0] todo multi
    this.toggleDropdown();
  }

  uncheckAll() {
    this.selectedOptions = [];
    this.filter(this.selectedOptions[0], this.column.name, null); // [0] todo multi
    this.toggleDropdown();
  }

  isSelected(option: ISelectOption): boolean {
    return this.selectedOptions && this.selectedOptions.indexOf(option.id) > -1;
  }

  updateNumSelected() {
    this.numSelected = this.selectedOptions && this.selectedOptions.length || 0;
  }

  show(width: number, top: number, left: number, column: ColumnModel) {
    this.column = column;
    this.selectedOptions = this.columnsSelectedOptions[column.name];
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

  filter(value, field, matchMode) {
    if (!isBlank(value)) {
      this.table.filters[field] = {value: value, matchMode: matchMode};
    } else if (this.table.filters[field]) {
      delete this.table.filters[field];
    }

    this.filterChanged.emit(this.table.filters);
    this.updateNumSelected();
    this.columnsSelectedOptions[field] = this.selectedOptions;
  }

  clearAllFilters() {
    this.table.filters = {};
    this.selectedOptions = [];
    this.columnsSelectedOptions = [];
    this.filterChanged.emit(this.table.filters);
  }

  onFilterChanged() {
    this.filterChanged.emit(this.table.filters);
  }

  onFilterClose() {
    this.toggleDropdown();
  }

}
