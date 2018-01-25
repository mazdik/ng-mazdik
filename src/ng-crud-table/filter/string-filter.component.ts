import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {DataTable, ColumnModel} from '../types';


@Component({
  selector: 'app-string-filter',
  template: `
    <div class="clearable-input">
      <input class="df-control"
             #searchFilterInput
             [attr.placeholder]="column.name"
             [value]="table.getFilterValue(column)"
             (click)="onFilterInputClick($event)"
             (keyup)="onFilterKeyup($event, column.name, null)"/>
      <span [style.display]="table.isFilter(column) ? 'block' : 'none' "
            (click)="uncheckAll()">&times;</span>
    </div>
  `,
})
export class StringFilterComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() public table: DataTable;
  @Input() public column: ColumnModel;
  @Input() public isOpen: boolean;

  @ViewChild('searchFilterInput') searchFilterInput: any;

  @Output() filterChanged: EventEmitter<any> = new EventEmitter();
  @Output() filterClose: EventEmitter<any> = new EventEmitter();

  filterTimeout: any;

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

  onFilterKeyup(event, field, matchMode) {
    const value = event.target.value;
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.filter(value, field, matchMode);
      this.filterTimeout = null;
    }, this.table.filterDelay);
  }

  filter(value, field, matchMode) {
    this.table.setFilter(value, field, matchMode);
    this.filterChanged.emit(this.table.filters);
  }

  uncheckAll() {
    this.filter(null, this.column.name, null);
    this.filterClose.emit(true);
  }

  setFocus() {
    if (this.searchFilterInput) {
      setTimeout(() => {
        this.searchFilterInput.nativeElement.focus();
      }, 1);
    }
  }

}
