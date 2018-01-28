import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import {DataTable, ColumnModel} from '../types';
import {FilterService} from '../services/filter.service';


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
             [value]="table.getFilterValue(column)"
             (input)="onFilterInput($event)"/>
      <span [style.display]="table.isFilter(column) ? 'block' : 'none' "
            (click)="uncheckAll()">&times;</span>
    </div>
  `,
})
export class StringFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() public table: DataTable;
  @Input() public column: ColumnModel;
  @Input() public isOpen: boolean;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter();
  @Output() filterClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  matchMode: string = FilterService.STARTS_WITH;
  stringOperators: any[];

  constructor() {
  }

  ngOnInit() {
    this.stringOperators = [
      {value: FilterService.EQUALS, text: this.table.settings.messages.equals},
      {value: FilterService.NOT_EQUAL, text: this.table.settings.messages.notEqual},
      {value: FilterService.STARTS_WITH, text: this.table.settings.messages.startsWith},
      {value: FilterService.ENDS_WITH, text: this.table.settings.messages.endsWith},
      {value: FilterService.CONTAINS, text: this.table.settings.messages.contains},
      {value: FilterService.NOT_CONTAINS, text: this.table.settings.messages.notContains}
    ];
  }

  ngAfterViewInit() {
    this.setFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setFocus();
    this.matchMode = this.table.getFilterMatchMode(this.column) || this.matchMode;
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
