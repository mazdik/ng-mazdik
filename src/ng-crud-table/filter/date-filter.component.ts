import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {DataTable, ColumnModel} from '../types';
import {FilterService} from '../services/filter.service';


@Component({
  selector: 'app-date-filter',
  template: `
    <div class="clearable-input">
      <input class="df-control"
             #filterInput
             [attr.type]="column.type"
             [attr.placeholder]="column.name"
             [value]="table.getFilterValue(column)"
             (click)="onFilterInputClick($event)"
             (keyup)="onFilterKeyup($event)"/>
      <span [style.display]="table.isFilter(column) ? 'block' : 'none' "
            (click)="uncheckAll()">&times;</span>
    </div>
  `,
})
export class DateFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() public table: DataTable;
  @Input() public column: ColumnModel;
  @Input() public isOpen: boolean;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();
  @Output() filterClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  matchMode: string = FilterService.EQUALS;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
  }

  onFilterInputClick(event) {
    event.stopPropagation();
  }

  onFilterKeyup(event) {
    const value = event.target.value;
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filter(value);
      this.filterTimeout = null;
    }, this.table.filterDelay);
  }

  filter(value) {
    this.table.setFilter(value, this.column.name, this.matchMode);
    this.filterChanged.emit(this.table.filters);
  }

  uncheckAll() {
    this.filter(null);
    this.filterClose.emit(true);
  }

  setFocus() {
    if (this.filterInput) {
      setTimeout(() => {
        this.filterInput.nativeElement.focus();
      }, 1);
    }
  }

}
