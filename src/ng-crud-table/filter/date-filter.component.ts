import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {DataTable, ColumnModel} from '../types';
import {FilterService} from '../services/filter.service';


@Component({
  selector: 'app-date-filter',
  template: `
    <select class="df-control sm"
            style="margin-bottom: 8px;"
            [(ngModel)]="matchMode"
            (change)="onModeChange()">
      <option *ngFor="let opt of numberOperators" [value]="opt.value">{{opt.text}}</option>
    </select>
    <input class="df-control"
           #filterInput
           [attr.type]="column.type"
           [attr.placeholder]="isRangeFilter() ? '>' : column.name"
           [value]="table.getFilterValue(column)"
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
    </ul>
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
  numberOperators: any[];
  valueTo: any;

  constructor() {
  }

  ngOnInit() {
    this.numberOperators = [
      {value: FilterService.EQUALS, text: this.table.settings.messages.equals},
      {value: FilterService.NOT_EQUAL, text: this.table.settings.messages.notEqual},
      {value: FilterService.GREATER_THAN, text: this.table.settings.messages.greaterThan},
      {value: FilterService.GREATER_THAN_OR_EQUAL, text: this.table.settings.messages.greaterThanOrEqual},
      {value: FilterService.LESS_THAN, text: this.table.settings.messages.lessThan},
      {value: FilterService.LESS_THAN_OR_EQUAL, text: this.table.settings.messages.lessThanOrEqual},
      {value: FilterService.IN_RANGE, text: this.table.settings.messages.inRange}
    ];
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
    this.matchMode = this.table.getFilterMatchMode(this.column) || this.matchMode;
    this.valueTo = this.table.getFilterValueTo(this.column);
  }

  onFilterInput() {
    const value = this.filterInput.nativeElement.value;
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filter(value);
      this.filterTimeout = null;
    }, this.table.filterDelay);
  }

  filter(value) {
    this.table.setFilter(value, this.column.name, this.matchMode, this.valueTo, 'date');
    this.filterChanged.emit(this.table.filters);
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
    return this.matchMode === FilterService.IN_RANGE;
  }


}
