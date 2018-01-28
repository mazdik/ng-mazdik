import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {DataTable, ColumnModel} from '../types';
import {FilterService} from '../services/filter.service';


@Component({
  selector: 'app-number-filter',
  template: `
    <select class="df-control sm"
            style="margin-bottom: 8px;"
            [(ngModel)]="matchMode"
            (change)="onModeChange()">
      <option *ngFor="let opt of numberOperators" [value]="opt.value">{{opt.text}}</option>
    </select>
    <div class="clearable-input">
      <input class="df-control"
             type="number"
             #filterInput
             [attr.placeholder]="column.name"
             [value]="table.getFilterValue(column)"
             (input)="onFilterInput($event)"/>
      <span [style.display]="table.isFilter(column) ? 'block' : 'none' "
            (click)="uncheckAll()">&times;</span>
    </div>
  `,
})
export class NumberFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() public table: DataTable;
  @Input() public column: ColumnModel;
  @Input() public isOpen: boolean;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();
  @Output() filterClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  matchMode: string = FilterService.EQUALS;
  numberOperators: any[];

  constructor() {
  }

  ngOnInit() {
    this.numberOperators = [
      {value: FilterService.EQUALS, text: this.table.settings.messages.equals},
      {value: FilterService.NOT_EQUAL, text: this.table.settings.messages.notEqual},
      {value: FilterService.GREATER_THAN, text: this.table.settings.messages.greaterThan},
      {value: FilterService.GREATER_THAN_OR_EQUAL, text: this.table.settings.messages.greaterThanOrEqual},
      {value: FilterService.LESS_THAN, text: this.table.settings.messages.lessThan},
      {value: FilterService.LESS_THAN_OR_EQUAL, text: this.table.settings.messages.lessThanOrEqual}
    ];
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
  }

  onFilterInput(event) {
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

  onModeChange() {
    const val = this.filterInput.nativeElement.value;
    if (val) {
      this.filter(val);
    }
  }

}
