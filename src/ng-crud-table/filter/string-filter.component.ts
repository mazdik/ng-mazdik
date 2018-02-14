import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {DataTable} from '../base/data-table';
import {Column} from '../base/column';
import {DataFilter} from '../base/data-filter';

@Component({
  selector: 'app-string-filter',
  template: `
    <select class="df-control sm"
            style="margin-bottom: 8px;"
            [(ngModel)]="matchMode"
            (change)="onModeChange()">
      <option *ngFor="let opt of stringOperators" [value]="opt.value">{{opt.text}}</option>
    </select>
    <div class="clearable-input">
      <input class="df-control"
             #filterInput
             [attr.placeholder]="column.name"
             [value]="table.dataFilter.getFilterValue(column.name)"
             (input)="onFilterInput($event)"/>
      <span [style.display]="table.dataFilter.isFilter(column.name) ? 'block' : 'none' "
            (click)="uncheckAll()">&times;</span>
    </div>
  `,
})
export class StringFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() public table: DataTable;
  @Input() public column: Column;
  @Input() public isOpen: boolean;
  @Output() filterClose: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  matchMode: string = DataFilter.STARTS_WITH;
  stringOperators: any[];

  constructor() {
  }

  ngOnInit() {
    this.stringOperators = [
      {value: DataFilter.EQUALS, text: this.table.settings.messages.equals},
      {value: DataFilter.NOT_EQUAL, text: this.table.settings.messages.notEqual},
      {value: DataFilter.STARTS_WITH, text: this.table.settings.messages.startsWith},
      {value: DataFilter.ENDS_WITH, text: this.table.settings.messages.endsWith},
      {value: DataFilter.CONTAINS, text: this.table.settings.messages.contains},
      {value: DataFilter.NOT_CONTAINS, text: this.table.settings.messages.notContains}
    ];
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
    this.matchMode = this.table.dataFilter.getFilterMatchMode(this.column.name) || this.matchMode;
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
    this.table.dataFilter.setFilter(value, this.column.name, this.matchMode);
    this.table.dataService.onFilter();
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
