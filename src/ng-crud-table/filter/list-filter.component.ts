import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {SelectOption} from '../types';
import {Column, DataTable, DataFilter} from '../base';

@Component({
  selector: 'app-list-filter',
  template: `
    <div class="clearable-input">
      <input class="df-control"
             placeholder="{{table.messages.search}}"
             #filterInput
             [(ngModel)]="searchFilterText"/>
      <span [style.display]="searchFilterText.length > 0 ? 'block' : 'none' "
            (click)="clearSearch()">&times;</span>
    </div>

    <ul class="list-menu">
      <li>
      <span (click)="uncheckAll()">
        <i class="icon icon-remove"></i>&nbsp;&nbsp;{{table.messages.clear}}
      </span>
      </li>
      <li *ngIf="column.selectionLimit !== 1">
      <span (click)="checkAll()">
        <i class="icon icon-ok"></i>&nbsp;&nbsp;{{table.messages.selectAll}}
      </span>
      </li>
      <li class="list-divider"></li>
      <li *ngFor="let option of column.options | filterBy: 'name':searchFilterText">
      <span [ngClass]="{'active': isSelected(option)}"
            (click)="setSelected(option.id)">
        <i class="icon" [class.icon-ok]="isSelected(option)"></i>&nbsp;&nbsp;{{ option.name }}
      </span>
      </li>
    </ul>
  `,
})
export class ListFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() public table: DataTable;
  @Input() public column: Column;
  @Input() public isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  selectedOptions: any;
  searchFilterText: string = '';

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
    this.clearSearch();
    this.selectedOptions = this.table.dataFilter.getFilterValue(this.column.name);
  }

  clearSearch() {
    this.searchFilterText = '';
  }

  setSelectedOptions(value: any) {
    if (!this.selectedOptions) {
      this.selectedOptions = [];
    }
    const index = this.selectedOptions.indexOf(value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      if (this.column.selectionLimit === 0 || this.selectedOptions.length < this.column.selectionLimit) {
        this.selectedOptions.push(value);
      } else {
        this.selectedOptions.push(value);
        this.selectedOptions.shift();
      }
    }
  }

  setSelected(value: any) {
    this.setSelectedOptions(value);
    this.filter(this.selectedOptions, this.column.name);
    this.filterClose.emit(true);
  }

  checkAll() {
    if (typeof this.column.options !== 'function') {
      this.selectedOptions = this.column.options.map(option => option.id);
    }
    this.filter(this.selectedOptions, this.column.name);
    this.filterClose.emit(true);
  }

  uncheckAll() {
    this.selectedOptions = [];
    this.filter(this.selectedOptions, this.column.name);
    this.filterClose.emit(true);
  }

  isSelected(option: SelectOption): boolean {
    return this.selectedOptions && this.selectedOptions.indexOf(option.id) > -1;
  }

  filter(value: any[], field: string) {
    const mode = value.length ? DataFilter.IN : DataFilter.EQUALS;
    this.table.dataFilter.setFilter(value, field, mode);
    this.table.events.onFilter();
  }

  setFocus() {
    if (this.filterInput) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

}
