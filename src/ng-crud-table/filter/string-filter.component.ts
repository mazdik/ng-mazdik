import {Component, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {DataTable, ColumnModel} from '../types';
import {isBlank} from '../utils/util';


@Component({
  selector: 'app-string-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="clearable-input">
      <input class="df-control"
             #filterInput
             [attr.placeholder]="column.name"
             *ngIf="column.filter"
             [value]="table.getFilterValue(column)"
             (click)="onFilterInputClick($event)"
             (keyup)="onFilterKeyup($event, column.name, null)"/>
      <span [style.display]="table.isFilter(column) ? 'block' : 'none' "
            (click)="uncheckAll()">&times;</span>
    </div>
  `,
})
export class StringFilterComponent {

  @Input() public table: DataTable;
  @Input() public column: ColumnModel = <ColumnModel> {};
  @Input() public filterDelay: number = 500;

  @Input()
  set isVisible(val: boolean) {
    this._isVisible = val;
    if (this._isVisible) {
      this.setFocus();
    }
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  @Output() filterChanged: EventEmitter<any> = new EventEmitter();
  @Output() filterClose: EventEmitter<any> = new EventEmitter();

  @ViewChild('filterInput') filterInput: any;

  filterTimeout: any;
  _isVisible: boolean;

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
    }, this.filterDelay);
  }

  filter(value, field, matchMode) {
    if (!isBlank(value)) {
      this.table.filters[field] = {value: value, matchMode: matchMode};
    } else if (this.table.filters[field]) {
      delete this.table.filters[field];
    }

    this.filterChanged.emit(this.table.filters);
  }

  uncheckAll() {
    this.filter(null, this.column.name, null);
    this.filterClose.emit(true);
  }

  setFocus() {
    setTimeout(() => {
      this.filterInput.nativeElement.focus();
    }, 1);
  }

}
