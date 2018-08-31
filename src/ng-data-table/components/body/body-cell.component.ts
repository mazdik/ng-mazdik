import {
  Component, Input, HostBinding, ViewContainerRef, ViewChild, OnInit, OnDestroy, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {Column, DataTable, Row, CellEventArgs} from '../../base';
import {Subscription} from 'rxjs';
import {addClass} from '../../base/util';

@Component({
  selector: 'dt-body-cell',
  templateUrl: 'body-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  @Input()
  set column(column: Column) {
    this._column = column;
    this.cellContext.column = column;
    this.updateValue();
  }

  get column(): Column {
    return this._column;
  }

  @Input()
  set row(row: Row) {
    this._row = row;
    this.cellContext.row = row;
    this.updateValue();
  }

  get row(): Row {
    return this._row;
  }

  @HostBinding('class')
  get columnCssClasses(): string {
    let cls = 'datatable-body-cell';
    if (this.column.cellClass) {
      if (typeof this.column.cellClass === 'string') {
        cls += ' ' + this.column.cellClass;
      } else if (typeof this.column.cellClass === 'function') {
        const res = this.column.cellClass({
          row: this.row,
          column: this.column,
          value: this.value,
        });
        cls = addClass(cls, res);
      }
    }
    if (this.editing) {
      cls += ' cell-editing';
    }
    if (this.row && this.row.$$data && this.cellContext.value !== this.column.getValue(this.row.$$data)) {
      cls += ' cell-changed';
    }
    if (this.hasError) {
      cls += ' cell-error';
    }
    return cls;
  }

  @HostBinding('attr.role') role = 'gridcell';

  @HostBinding('style.width.px')
  get width(): number {
    return this.column.width;
  }

  @HostBinding('attr.data-column-index')
  get attrColumnIndex(): number {
    return this.column.index;
  }

  @HostBinding('attr.data-row-index')
  get attrRowIndex(): number {
    return (this.row) ? this.row.$$index : null;
  }

  @ViewChild('cellTemplate', {read: ViewContainerRef}) cellTemplate: ViewContainerRef;

  value: any;
  oldValue: any;
  cellContext: any = {
    row: this.row,
    value: this.value,
    column: this.column,
  };
  editing: boolean;
  subscriptions: Subscription[] = [];
  hasError: boolean;
  private _column: Column;
  private _row: Row;

  constructor(public cd: ChangeDetectorRef, public element: ElementRef) {
  }

  ngOnInit(): void {
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.updateValue();
    });
    const subActivateCell = this.table.events.activateCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.row.$$index === ev.rowIndex && this.column.index === ev.columnIndex) {
        this.element.nativeElement.focus();
      }
    });
    this.subscriptions.push(subRows);
    this.subscriptions.push(subActivateCell);
  }

  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  updateValue(): void {
    if (this.column) {
      this.cellContext.value = this.column.getValue(this.row);
      if (this.cellContext.value !== this.oldValue) {
        this.oldValue = this.cellContext.value;
        this.value = this.column.getValueView(this.row);
      }
      if (this.hasError) {
        this.validate();
      }
    }
    this.cd.markForCheck();
  }

  validate() {
    const errors = this.column.validate(this.row[this.column.name]);
    this.hasError = (errors && errors.length > 0);
  }

}
