import {Component, Input, Output, OnInit, EventEmitter, ChangeDetectionStrategy, ViewChild} from '@angular/core';
import {ISelectOption, Column, Filter} from '../types/interfaces';

@Component({
  selector: 'ng-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {

  @Input() filters: Filter = {};
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  column: Column = <Column> {};

  @ViewChild('selectionSpan') selectionSpan: any;
  @ViewChild('searchFilterInput') searchFilterInput: any;
  @ViewChild('filterInput') filterInput: any;

  // Width and position for the dropdown container.
  left: number;
  top: number;
  width: number;

  selectionLimit: number = 1;
  selectedOptions: any[];
  columnsSelectedOptions: any[] = [];
  numSelected: number = 0;
  isVisible: boolean = false;
  searchFilterText: string = '';

  selectContainerClicked: boolean = false;
  filterTimeout: any;

  constructor() {
  }

  ngOnInit() {
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
      } else {
        setTimeout(() => {
          this.filterInput.nativeElement.focus();
        }, 1);
      }
    }
  }

  closeDropdown() {
    if (this.isVisible) {
      this.clearSearch();
      this.isVisible = false;
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

  onSelectContainerClick(event: any) {
    this.selectContainerClicked = true;
  }

  onWindowClick() {
    if (!this.selectContainerClicked) {
      this.closeDropdown();
    }
    this.selectContainerClicked = false;
  }

  show(width: number, top: number, left: number, column: Column) {
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

  onFilterInputClick(event) {
    event.stopPropagation();
  }

  onFilterKeyup(value, field, matchMode) {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filter(value, field, matchMode);
      this.filterTimeout = null;
    }, 300);
  }

  filter(value, field, matchMode) {
    if (!this.isFilterBlank(value)) {
      this.filters[field] = {value: value, matchMode: matchMode};
    } else if (this.filters[field]) {
      delete this.filters[field];
    }

    this.onFilter.emit(this.filters);
    this.updateNumSelected();
    this.columnsSelectedOptions[field] = this.selectedOptions;
  }

  isFilterBlank(filter: any): boolean {
    if (filter !== null && filter !== undefined) {
      if ((typeof filter === 'string' && filter.trim().length === 0) || (filter instanceof Array && filter.length === 0)) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  clearAllFilters() {
    this.filters = {};
    this.selectedOptions = [];
    this.columnsSelectedOptions = [];
    this.onFilter.emit(this.filters);
  }

  setColumnSelectedOption(value, field, matchMode) {
    this.selectedOptions = this.columnsSelectedOptions[field];
    if (value) {
      this.selectedOptions = [];
      this.selectedOptions.push(value);
    } else {
      this.selectedOptions = [];
    }
    this.updateNumSelected();
    this.columnsSelectedOptions[field] = this.selectedOptions;
  }

}
