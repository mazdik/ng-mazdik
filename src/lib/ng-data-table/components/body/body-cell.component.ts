import {
  Component, Input, HostBinding, ViewContainerRef, ViewChild, OnInit, OnDestroy, ElementRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {DataTable, Cell, CellEventArgs} from '../../base';
import {Subscription} from 'rxjs';

@Component({
  selector: 'dt-body-cell',
  templateUrl: 'body-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BodyCellComponent implements OnInit, OnDestroy {

  @Input() table: DataTable;

  @Input()
  get cell(): Cell { return this._cell; }
  set cell(val: Cell) {
    this._cell = val;
    this.updateValue();
  }
  private _cell: Cell;

  @HostBinding('class.datatable-body-cell') cssClass = true;
  @HostBinding('class.cell-editing') get cssEditing(): boolean {
    return this.editing;
  }
  @HostBinding('class.cell-changed') get cssChanged(): boolean {
    return this.cell.isChanged;
  }
  @HostBinding('class.cell-error') get cssError(): boolean {
    return this.cell.hasError;
  }

  @HostBinding('attr.role') role = 'gridcell';

  @HostBinding('style.width.px')
  get width(): number {
    return this.cell.column.width;
  }

  @HostBinding('attr.data-column-index')
  get attrColumnIndex(): number {
    return this.cell.column.index;
  }

  @HostBinding('attr.data-row-index')
  get attrRowIndex(): number {
    return (this.cell.row) ? this.cell.row.$$index : null;
  }

  @ViewChild('cellTemplate', {read: ViewContainerRef}) cellTemplate: ViewContainerRef;

  value: any;
  oldValue: any;
  editing: boolean;
  subscriptions: Subscription[] = [];

  constructor(public cd: ChangeDetectorRef, public element: ElementRef) {}

  ngOnInit(): void {
    const subRows = this.table.events.rowsChanged$.subscribe(() => {
      this.updateValue();
    });
    const subActivateCell = this.table.events.activateCellSource$.subscribe((ev: CellEventArgs) => {
      if (this.cell.exist(ev.rowIndex, ev.columnIndex)) {
        this.element.nativeElement.focus();
      }
    });
    const subSelection = this.table.events.selectionSource$.subscribe(() => {
      this.cd.markForCheck();
    });
    this.subscriptions.push(subRows);
    this.subscriptions.push(subActivateCell);
    this.subscriptions.push(subSelection);
  }

  ngOnDestroy(): void {
    if (this.cellTemplate) {
      this.cellTemplate.clear();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  updateValue(): void {
    if (this.cell.value !== this.oldValue) {
      this.oldValue = this.cell.value;
      this.value = this.cell.column.getValueView(this.cell.row);
    }
    this.cell.validate();
    this.cd.markForCheck();
  }

}
