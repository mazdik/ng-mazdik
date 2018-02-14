import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {DataTable} from '../base/data-table';
import {Column} from '../base/column';
import {DataFilter} from '../base/data-filter';

@Component({
  selector: 'app-range-filter',
  template: `
    <select class="df-control sm"
            style="margin-bottom: 8px;"
            [(ngModel)]="matchMode"
            (change)="onModeChange()">
      <option *ngFor="let opt of operators" [value]="opt.value">{{opt.text}}</option>
    </select>
    <input class="df-control"
           #filterInput
           [attr.type]="column.type"
           [attr.placeholder]="isRangeFilter() ? '>' : column.name"
           [value]="table.dataFilter.getFilterValue(column.name)"
           (input)="onFilterInput()"/>
    <input class="df-control"
           style="margin-top: 8px;"
           [attr.type]="column.type"
           [attr.placeholder]="'<'"
           *ngIf="isRangeFilter()"
           [(ngModel)]="valueTo"
           (input)="onFilterInput()"/>
    <ul class="list-menu">
      <li>
      <span (click)="uncheckAll()">
        <i class="icon icon-remove"></i>&nbsp;&nbsp;{{table.settings.messages.clear}}
      </span>
      </li>
      <ng-template [ngIf]="(column.type ==='date' || column.type ==='datetime-local')">
        <li (click)="lastDate('year')"><span>{{table.settings.messages.lastYear}}</span></li>
        <li (click)="lastDate('month')"><span>{{table.settings.messages.lastMonth}}</span></li>
        <li (click)="lastDate('day')"><span>{{table.settings.messages.lastDay}}</span></li>
        <li (click)="lastDate('hour')"><span>{{table.settings.messages.lastHour}}</span></li>
      </ng-template>
    </ul>
  `,
})
export class RangeFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() public table: DataTable;
  @Input() public column: Column;
  @Input() public isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  matchMode: string = DataFilter.EQUALS;
  operators: any[];
  valueTo: any;
  type: string;

  constructor() {
  }

  ngOnInit() {
    this.operators = [
      {value: DataFilter.EQUALS, text: this.table.settings.messages.equals},
      {value: DataFilter.NOT_EQUAL, text: this.table.settings.messages.notEqual},
      {value: DataFilter.GREATER_THAN, text: this.table.settings.messages.greaterThan},
      {value: DataFilter.GREATER_THAN_OR_EQUAL, text: this.table.settings.messages.greaterThanOrEqual},
      {value: DataFilter.LESS_THAN, text: this.table.settings.messages.lessThan},
      {value: DataFilter.LESS_THAN_OR_EQUAL, text: this.table.settings.messages.lessThanOrEqual},
      {value: DataFilter.IN_RANGE, text: this.table.settings.messages.inRange}
    ];
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
    this.matchMode = this.table.dataFilter.getFilterMatchMode(this.column.name) || this.matchMode;
    this.valueTo = this.table.dataFilter.getFilterValueTo(this.column.name);
  }

  onFilterInput() {
    const value = this.filterInput.nativeElement.value;
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filter(value);
      this.filterTimeout = null;
    }, this.table.settings.filterDelay);
  }

  filter(value) {
    this.table.dataFilter.setFilter(value, this.column.name, this.matchMode, this.valueTo, this.column.type);
    this.table.dataService.onFilter();
  }

  uncheckAll() {
    this.valueTo = null;
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

  onModeChange() {
    const val = this.filterInput.nativeElement.value;
    if (val) {
      this.filter(val);
    }
  }

  isRangeFilter() {
    return this.matchMode === DataFilter.IN_RANGE;
  }

  lastDate(name: string) {
    let dt: Date;
    if (name === 'year') {
      dt = new Date();
      dt.setMonth(dt.getMonth() - 12);
    } else if (name === 'month') {
      dt = new Date();
      dt.setMonth(dt.getMonth() - 1);
    } else if (name === 'day') {
      dt = new Date(Date.now() + -1 * 24 * 3600 * 1000);
    } else if (name === 'hour') {
      dt = new Date(Date.now() + -1 * 3600 * 1000);
    }
    this.matchMode = DataFilter.GREATER_THAN_OR_EQUAL;
    this.filter(dt.toISOString().slice(0, 16));
    this.filterClose.emit(true);
  }


}
